<?php

namespace App\Http\Controllers;

use App\Models\TrainingPlan;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Auth;

class AccountTrainingsPlanController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $userId = auth()->id();

        $account = Account::where('user_id', $userId)->first();

        if ($account->subscription_id === 1) {
            if ($account->trainingPlans()->exists()) {
                $plans = $account->trainingPlans()->with('exercises')->get();

                return response()->json([
                    'activePlans' => $plans,
                    'completedPlans' => [],
                ], 200);
            }

            $recommendedPlan = TrainingPlan::where('level', $account->fitness_level)->first();

            if (!$recommendedPlan) {
                return response()->json([
                    'message' => 'No recommended training plan found for your level.',
                ], 404);
            }

            $account->trainingPlans()->attach($recommendedPlan->training_plan_id);

            $plans = $account->trainingPlans()->with('exercises')->get();

            return response()->json([
                'message' => 'Recommended training plan added successfully.',
                'activePlans' => $plans,
                'completedPlans' => [],
            ], 200);
        }

        $trainingPlans = $account->trainingPlans()->with('exercises')->get();

        $activePlans = [];
        $completedPlans = [];

        foreach ($trainingPlans as $plan) {
            $this->checkPlanCompletionAndReward($account, $plan);

            if ($plan->pivot->completed_at) {
                $completedPlans[] = $plan;
            } else {
                $activePlans[] = $plan;
            }
        }

        return response()->json([
            'activePlans' => $activePlans,
            'completedPlans' => $completedPlans,
        ], 200);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $userId = auth()->id();

        $account = Account::where('user_id', $userId)->first();

        if ($account->subscription_id === 1) {
            return response()->json([
                'message' => 'You cannot add training plans with a Bronze subscription. Upgrade your subscription to add plans.',
            ], 403);
        }

        $validated = $request->validate(['training_plan_id' => 'required|exists:training_plans,training_plan_id',
        ]);

        if ($account->trainingPlans()->where('account_training_plan.training_plan_id', $validated['training_plan_id'])->exists()) {
            return response()->json([
                'message' => 'Training plan already exists',
            ], 409);
        }

        $account->trainingPlans()->attach($validated['training_plan_id']);

        return response()->json([
            'message' => 'Training plan added successfully',
        ],201);
    }

    public function destroy($trainingPlanId){

        $user = Auth::user();

        $account = $user->account;

        $trainingPlan = $account->trainingPlans()
            ->where('account_training_plan.training_plan_id', $trainingPlanId)
            ->first();

        if(!$trainingPlanId){
            return response()->json([
                'message' => 'Training plan not found',
            ], 404);
        }

        $account->trainingPlans()->detach($trainingPlanId);

        return response()->json([
            'message' => 'Training plan deleted successfully',
        ], 200);
    }

    private function checkPlanCompletionAndReward(Account $account, TrainingPlan $trainingPlan)
    {
        if (!$trainingPlan->exercises || $trainingPlan->exercises->isEmpty()) {
            return;
        }

        if ($account->hasCompletedTrainingPlan($trainingPlan)) {
            $pivotData = $account->trainingPlans()->wherePivot('training_plan_id', $trainingPlan->id)->first();
            if ($pivotData && !$pivotData->pivot->completed_at) {
                $account->increment('fit_points', 50);
                $account->trainingPlans()->updateExistingPivot($trainingPlan->id, ['completed_at' => now()]);
            }
        }
    }

    public function completePlan($trainingPlanId)
    {
        $user = auth()->user();
        $account = $user->account;

        $trainingPlan = $account->trainingPlans()->where('account_training_plan.training_plan_id', $trainingPlanId)->first();

        if (!$trainingPlan) {
            return response()->json(['message' => 'Training plan not found'], 404);
        }

        if ($account->hasCompletedTrainingPlan($trainingPlan)) {
            $pivotData = $account->trainingPlans()->wherePivot('training_plan_id', $trainingPlanId)->first();

            if ($pivotData && !$pivotData->pivot->completed_at) {
                $account->increment('fit_points', 50);
                $account->trainingPlans()->updateExistingPivot($trainingPlanId, ['completed_at' => now()]);

                return response()->json([
                    'message' => 'Training plan marked as completed',
                    'fit_points_added' => 50,
                ], 200);
            }

            return response()->json(['message' => 'Plan already completed'], 200);
        }

        return response()->json(['message' => 'Not all exercises completed'], 409);
    }

}
