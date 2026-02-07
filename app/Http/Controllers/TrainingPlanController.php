<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\TrainingPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrainingPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'goal' => 'required|in:gain_weight,lose_weight,maintain_fitness',
            'level' => 'required|in:beginner,intermediate,advanced',
        ]);

        $validated['created_by'] = auth()->id();

        $trainingPlan = TrainingPlan::create($validated);

        return response()->json([
            'message' => 'Training plan created successfully',
            'training_plan' => $trainingPlan,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showTrainingPlansList()
    {
        $trainingPlans = TrainingPlan::all();

        return response()->json([
        'training_plans' => $trainingPlans,
        ], 200);
    }

    public function show(string $id)
    {
        $trainingPlan = TrainingPlan::findOrFail($id);

        if (!$trainingPlan) {
            return response()->json(['message' => 'Training Plan not found'], 404);
        }

        return response()->json([
            'training_plan' => $trainingPlan,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'goal' => 'required|in:gain_weight,lose_weight,maintain_fitness',
            'level' => 'sometimes|required|in:beginner,intermediate,advanced',
        ]);

        $trainingPlan = TrainingPlan::findOrFail($id);
        $trainingPlan->update($validated);

        return response()->json([
            'message' => 'Training plan updated successfully',
            'training_plan' => $trainingPlan->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $trainingPlan = TrainingPlan::findOrFail($id);

        $trainingPlan->delete();

        return response()->json([
            'message' => 'Training plan deleted successfully',
        ], 200);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['message' => 'Query parameter is required'], 400);
        }

        $trainingPlans = TrainingPlan::where('title', 'like', '%' . $query . '%')->get();

        return response()->json([
            'training_plans' => $trainingPlans,
        ], 200);
    }

    public function filter(Request $request)
    {
        $user = auth()->user();
        $userId = auth()->id();


        $account = Account::where('user_id', $userId)->first();

        if ($account->subscription_id === 1) {
            return response()->json([
                'message' => 'Upgrade your subscription to use filters.',
            ], 403);
        }

        $validated = $request->validate([
            'level' => 'nullable|in:beginner,intermediate,advanced',
            'goal' => 'nullable|in:gain_weight,lose_weight,maintain_fitness',
            'query' => 'nullable|string|max:255',
        ]);

        $query = TrainingPlan::query();

        if (isset($validated['level'])) {
            $query->where('level', $validated['level']);
        }

        if (isset($validated['goal'])) {
            $query->where('goal', $validated['goal']);
        }

        if (isset($validated['query'])) {
            $query->where('title', 'like', '%' . $validated['query'] . '%');
        }

        $trainingPlans = $query->get();

        return response()->json([
            'training_plans' => $trainingPlans,
        ], 200);
    }

    public function getRecommendedPlans(Request $request)
    {
        $user = Auth::user();
        $userId = auth()->id();

        $account = Account::where('user_id', $userId)->first();

        if ($account->subscription_id === 1) {
            $plans = TrainingPlan::where('level', $account->fitness_level)
                ->limit(1)
                ->get();
        } else {
            $plans = TrainingPlan::where('level', $account->fitness_level)
                ->limit(2)
                ->get();
        }

        return response()->json($plans, 200);
    }
}
