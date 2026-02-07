<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Account;
use App\Models\Admin;
use App\Models\Trainer;
use Illuminate\Auth\Events\Registered;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'age' => 'required|integer|min:16|max:100',
            'gender' => 'required|in:male,female,other',
            'fitness_level' => 'required|in:beginner,intermediate,advanced',
            'weight' => 'required|integer|min:30|max:300',
            'height' => 'required|integer|min:100|max:300',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $validated = $validator->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            \Log::info('User ID:', ['id' => $user->id]);

            Account::create([
                'user_id' => $user->id,
                'registration_date' => now(),
                'age' => $validated['age'],
                'gender' => $validated['gender'],
                'fitness_level' => $validated['fitness_level'],
                'weight' => $validated['weight'],
                'height' => $validated['height'],
                'profile_picture' => 'images/user.jpg'
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        event(new Registered($user));

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }


    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);
        $frontendUrl = sprintf('%s:%s', rtrim(env('FRONTEND_URL'), '/'), env('FRONTEND_PORT'));
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect($frontendUrl . '/confirmed?message=invalid verification link')->setStatusCode(403);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect($frontendUrl . '/confirmed?message=your e-mail is already verified');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect($frontendUrl . '/confirmed?message=e-mail successfully verified');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid login'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        if (\DB::table('admins')->where('user_id', $user->id)->exists()) {
            $role = 'admin';
        } elseif (\DB::table('trainers')->where('user_id', $user->id)->exists()) {
            $role = 'trainer';
        } elseif (\DB::table('accounts')->where('user_id', $user->id)->exists()) {
            $role = 'user';
        } else {
            $role = 'user';
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $role
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $tokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', $tokenId)->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    public function logoutFromAllDevices(Request $request)
{
    $request->user()->tokens()->delete();

    return response()->json([
        'message' => 'Logged out from all devices successfully',
    ], 200);
}

    /**
     ** Creating an administrator (from the system only)
     */
    public function createAdmin(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);



        $validated = $validator->validated();

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            \Log::info('User ID:', ['id' => $user->id]);


            Admin::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'last_login' => null,
                'profile_picture' => 'images/admin.jpg'
            ]);
        });


        return response()->json(['message' => 'Admin registered successfully'], 201);
    }

    /**
     *  Method for creating a trainer (called by administrator)
     */
    public function createTrainer(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'expertise' => 'required|string|max:1000',
            'bio' => 'nullable|string|max:2000',
            'profile_picture' => 'nullable|image|max:2048',
        ]);

        $validated = $validator->validated();


        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('trainer_pictures', 'public');
            $validated['profile_picture'] = $path;
        }

        $trainer = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            return Trainer::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'expertise' => $validated['expertise'],
                'bio' => $validated['bio'] ?? null,
                'profile_picture' => $validated['profile_picture'] ?? 'images/trainer/default_trainer.png',
            ]);
        });

        return response()->json([
            'message' => 'Trainer created successfully',
            'trainer' => $trainer,
        ], 201);
    }


}
