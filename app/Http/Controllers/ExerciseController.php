<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ExerciseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showExercisesList()
    {
        $exercises = Exercise::all();
        return response()->json($exercises);
    }

    public function show(string $id)
    {
        $exercise = Exercise::find($id);

        if (!$exercise) {
            return response()->json(['message' => 'Exercise not found'], 404);
        }

        return response()->json([
            'message' => 'Exercise retrieved successfully',
            'exercise' => $exercise,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'video_url' => 'required|string|unique:exercises|max:100',
            'description' => 'required|string|max:500',
        ]);

        $userId = auth()->user()->id;
        $admin = Admin::where('user_id', $userId)->first();

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $exercise = Exercise::create([
            'name' => $validated['name'],
            'video_url' => $validated['video_url'],
            'description' => $validated['description'],
            'picture' => null,
            'created_by' => $admin->admin_id,
        ]);

        return response()->json([
            'message' => 'Exercise created successfully',
            'exercise' => $exercise,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'video_url' => 'sometimes|required|string|unique:exercises,video_url,' . $id . ',exercise_id|max:100',
            'description' => 'sometimes|required|string|max:500',
        ]);

        $exercise = Exercise::findOrFail($id);

        $exercise->update($validated);

        return response()->json([
            'message' => 'Exercise updated successfully',
            'exercise' => $exercise,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $exercise = Exercise::findOrFail($id);

        $exercise->delete();
        return response()->json([
        'message' => 'Exercise deleted successfully',
        ], 200);
    }
}
