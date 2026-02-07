<?php

namespace App\Http\Controllers;

use App\Models\TrainingPlan;
use Illuminate\Http\Request;

class TrainingPlanExerciseController extends Controller
{
    public function show($trainingPlanId)
    {
        $plan = TrainingPlan::with('exercises')->findOrFail($trainingPlanId);

        if (!$plan) {
            return response()->json([
                'message' => 'Training plan not found',
            ], 404);
        }

        $exercises = $plan->exercises;

        if (auth()->check() && auth()->user()->account) {
            $account = auth()->user()->account;

            $completedExerciseIds = $account->exercises()
                ->wherePivot('training_plan_id', $trainingPlanId) // теперь точно ID
                ->wherePivotNotNull('completed_at')
                ->pluck('account_exercise.exercise_id')
                ->toArray();

            $exercises = $exercises->map(function ($exercise) use ($completedExerciseIds) {
                $exercise->completed = in_array($exercise->exercise_id, $completedExerciseIds);
                return $exercise;
            });
        }

        return response()->json([
            'trainingPlanId' => $plan->training_plan_id,
            'exercises' => $exercises,
        ], 200);
    }

    public function update(Request $request, $trainingPlanId){

        $trainingPlan = TrainingPlan::with('exercises')->findOrFail($trainingPlanId);
        if (!$trainingPlanId) {
            return response()->json([
                'message' => 'Training plan not found',
            ], 404);
        }

        $validated = $request->validate(['exercise_id' => 'required|exists:exercises,exercise_id']);

        if($trainingPlan->exercises()->where('exercise_training_plan.exercise_id', $validated['exercise_id'])->exists()){
            return response()->json([
                'message' => 'This exercise is already in this training plan',
            ], 409);
        }

        $trainingPlan->exercises()->attach($validated['exercise_id']);

        return response()->json([
            'message' => 'Exercise added to training plan successfully',
        ], 201);
    }

    public function removeExercise(Request $request, $trainingPlanId, $exerciseId)
    {
        $trainingPlan = TrainingPlan::with('exercises')->findOrFail($trainingPlanId);

        if (!$trainingPlan->exercises()->where('exercise_training_plan.exercise_id', $exerciseId)->exists()) {
            return response()->json([
                'message' => 'This exercise is not in the training plan',
            ], 404);
        }

        $trainingPlan->exercises()->detach($exerciseId);

        return response()->json([
            'message' => 'Exercise removed from training plan successfully',
        ], 200);
    }
}
