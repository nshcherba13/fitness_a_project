<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trainer;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $trainers = Trainer::with('user')->get();

        $formattedTrainers = $trainers->map(function ($trainer) {
            return [
                'id' => $trainer->id,
                'user_id' => $trainer->user_id,
                'email' => $trainer->user->email ?? 'N/A',
                'first_name' => $trainer->first_name,
                'last_name' => $trainer->last_name,
                'expertise' => $trainer->expertise,
                'bio' => $trainer->bio,
                'created_at' => $trainer->created_at,
                'updated_at' => $trainer->updated_at,
                'profile_picture' => $trainer->profile_picture,
            ];
        });
        return response()->json([
            'message' => 'Trainers retrieved successfully',
            'trainers' => $formattedTrainers,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $id = $request->input('id');
        $trainer = Trainer::find($id);

        if (!$trainer) {
            return response()->json(['message' => 'Trainer not found'], 404);
        }

        return response()->json([
            'message' => 'Trainer retrieved successfully',
            'trainer' => [
                'id' => $trainer->id,
                'user_id' => $trainer->user_id,
                'email' => $trainer->user->email,
                'first_name' => $trainer->first_name,
                'last_name' => $trainer->last_name,
                'expertise' => $trainer->expertise,
                'bio' => $trainer->bio,
                'created_at' => $trainer->created_at,
                'updated_at' => $trainer->updated_at,
                'profile_picture' => $trainer->profile_picture,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $id = $request->input('id');
        $trainer = Trainer::find($id);

        if (!$trainer) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validator = Validator::make($request->all(), [
            //Users
            'email' => 'nullable|email|unique:users,email,' . $trainer->user_id,
            'password' => 'nullable|string|min:8',

            //Trainers
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'expertise' => 'nullable|string',
            'bio' => 'nullable|string',

        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $validated = $validator->validated();

        $user = $trainer->user;
        $user->update([
            'name' => trim(($validated['first_name'] ?? $trainer->first_name) . ' ' . ($validated['last_name'] ?? $trainer->last_name)) ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        $trainer->update([
            'first_name' => $validated['first_name'] ?? $trainer->first_name,
            'last_name' => $validated['last_name'] ?? $trainer->last_name,
            'expertise' => $validated['expertise'] ?? $trainer->expertise,
            'bio' => $validated['bio'] ?? $trainer->bio,
            'profile_picture' => $trainer->profile_picture,

        ]);

        return response()->json([
            'message' => 'Trainer updated successfully',
            'trainer' => $trainer,
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $trainer = Trainer::find($id);

        if (!$trainer) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $trainer->delete();
        return response()->json([
            'message' => 'Trainer deleted successfully',
        ]);
    }

    /**
     * Display Trainer Info for Trainer
     */
    public function showInfo()
    {
        if (!auth()->user()->trainer) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $trainer = Trainer::where('user_id', $userId)->first();

        if (!$trainer) {
            return response()->json(['message' => 'Trainer not found'], 404);
        }

        return response()->json([
            'trainer' => [
                'id' => $trainer->id,
                'user_id' => $trainer->user_id,
                'email' => $trainer->user->email,
                'first_name' => $trainer->first_name,
                'last_name' => $trainer->last_name,
                'expertise' => $trainer->expertise,
                'bio' => $trainer->bio,
                'created_at' => $trainer->created_at,
                'updated_at' => $trainer->updated_at,
                'profile_picture' => $trainer->profile_picture,
            ],
        ]);
    }
    public function showTrainersID()
    {
        //$trainers = Trainer::where('user_id', $userId)->all();
        $trainers = Trainer::select('id','user_id','first_name', 'last_name')->get();

        /*if ($trainers->count() == 0) {
            return response()->json(['message' => 'No trainers found'], 404);
        }*/
        Log::info('Trainer Daten:', ['trainers' => $trainers]);
        return response()->json([
            'message' => 'Trainers retrieved successfully',
            'trainers' => $trainers,
        ]);
    }
    public function showTrainersToUsers()
    {
        $trainers = Trainer::select('id','user_id','first_name', 'last_name', 'expertise', 'bio', 'profile_picture')->get();
        $trainersIds = Trainer::select('id','first_name', 'last_name')->get();

        if ($trainers->isEmpty()) {
            return response()->json(['message' => 'No trainers found'], 404);
        }

        return response()->json([
            'message' => 'Trainers retrieved successfully',
            'trainers' => $trainers,
            'trainersid'=> $trainersIds
        ]);
    }
}
