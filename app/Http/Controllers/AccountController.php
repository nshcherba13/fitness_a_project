<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $accounts = Account::all();
        return response()->json([
            'message' => 'Accounts retrieved successfully',
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    //Must be deleted
    public function store(Request $request)
    {
        //
    }

    /**
     * Display UserInfo for Admin.
     */
    public function show(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $id = $request->input('id');
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user = User::find($account->user_id);

        $subscriptionName = Subscription::find($account->subscription_id)->name ?? null;

        return response()->json([
            'account' => [
                'account_id' => $account->account_id,
                'registration_date' => $account->registration_date,
                'age' => $account->age,
                'gender' => $account->gender,
                'fitness_level' => $account->fitness_level,
                'weight' => $account->weight,
                'height' => $account->height,
                'subscription' => $subscriptionName,
                'profile_picture' => $account->profile_picture,
                'fit_points' => $account->fit_points,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'user_id' => $user->id,
            ],
        ]);
    }

    /**
     * Display UserInfo for User.
     */
    public function showInfo()
    {

        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $user = auth()->user();
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'No associated account found'], 403);
        }

        $subscriptionName = Subscription::find($account->subscription_id)->name ?? null;

        return response()->json([
            'account' => [
                'user_id' => $account->user_id,
                'account_id' => $account->account_id,
                'registration_date' => $account->registration_date,
                'age' => $account->age,
                'gender' => $account->gender,
                'fitness_level' => $account->fitness_level,
                'weight' => $account->weight,
                'height' => $account->height,
                'subscription' => $subscriptionName,
                'profile_picture' => $account->profile_picture,
                'fit_points' => $account->fit_points,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'No associated account found'], 403);
        }


        $validator = Validator::make($request->all(), [
            //Users
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $account->user_id,
            'password' => 'nullable|string|min:8',

            //Accounts
            'age' => 'nullable|integer|min:16|max:100',
            'gender' => 'nullable|in:male,female,other',
            'fitness_level' => 'nullable|in:beginner,intermediate,advanced',
            'weight' => 'nullable|integer|min:30|max:300',
            'height' => 'nullable|integer|min:100|max:300',
            'subscription_id' => 'nullable|exists:subscriptions,subscription_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $validated = $validator->validated();

        $user = $account->user;
        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);


        $account->update([
            'age' => $validated['age'] ?? $account->age,
            'gender' => $validated['gender'] ?? $account->gender,
            'fitness_level' => $validated['fitness_level'] ?? $account->fitness_level,
            'weight' => $validated['weight'] ?? $account->weight,
            'height' => $validated['height'] ?? $account->height,
            'subscription_id' => $validated['subscription_id'] ?? $account->subscription_id,
        ]);

        return response()->json([
            'message' => 'Account updated successfully',
            'account' => $account,
            'user' => $user,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'No associated account found'], 403);
        }
        $account->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }

    /**
     * Show training plans for user
     */

    public function showAvailableTrainingPlans(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'No associated account found'], 403);
        }

        $trainingPlans = $account->trainingPlans()->get(['training_plans.training_plan_id', 'title', 'description', 'goal', 'level']);

        return response()->json([
            'message' => 'Available training plans retrieved successfully',
            'account_id' => $account->account_id,
            'training_plans' => $trainingPlans,
        ], 200);
    }

    public function canWriteToTrainer(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'No associated account found'], 403);
        }

        $canWrite = $account->subscription_id === 3;

        return response()->json([
            'message' => $canWrite ? 'User is able to write to trainer' : 'User is not allowed to write to trainer',
            'is_able_to_write' => $canWrite,
        ], 200);
    }

    public function updateSubscription(Request $request){
        $user = auth()->user();
        $subscriptionId = $request->input('subscription_id');

        $subscription = Subscription::find($subscriptionId);
        if (!$subscription) {
            return response()->json(['message' => 'Invalid subscription ID'], 400);
        }

        $account = $user->account;
        if ($account) {
            $account->subscription_id = $subscriptionId;
            $account->save();

            return response()->json(['message' => 'Subscription updated successfully'], 200);
        }

        return response()->json(['message' => 'Account not found'], 404);
    }

    public function showUsersToTrainers()
    {
        /*
        $accountIds = Account::select('account_id')->get();

        $user = Account::select('user_id')->get();

        $userName = User::whereIn('id',$user)->select('name')->get();
        */

        $accounts = Account::select('account_id', 'user_id')->get();

        $userIds = $accounts->pluck('user_id');
        $users = User::whereIn('id', $userIds)->select('id', 'name')->get();


        $userMap = $users->keyBy('id');

        $accountsWithUsers = $accounts->map(function ($account) use ($userMap) {
            return [
                'account_id' => $account->account_id,
                'user_id' => $account->user_id,
                'user_name' => optional($userMap->get($account->user_id))->name
            ];
        });

        return response()->json([
            'message' => 'Accounts retrieved successfully',
            'accountIds' => $accountsWithUsers
        ]);
    }

}
