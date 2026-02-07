<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Account extends Model {
    protected $primaryKey = 'account_id';

    use HasFactory;
    protected $fillable = [
        'user_id',
        'registration_date',
        'age',
        'gender',
        'fitness_level',
        'weight',
        'height',
        'profile_picture',
        'fit_points',
    ];
    public function subscription()
    {
        return $this->belongsTo(Subscription::class, 'subscription_id', 'subscription_id');
    }

    // Beziehungen für Messages
    public function sentMessages()
    {
        return $this->morphMany(Message::class, 'sender');
    }

    public function receivedMessages()
    {
        return $this->morphMany(Message::class, 'receiver');
    }


    public function trainingPlans()
    {
        return $this->belongsToMany(TrainingPlan::class, 'account_training_plan', 'account_id', 'training_plan_id')
            ->withPivot('completed_at');
    }


    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'account_exercise', 'account_id', 'exercise_id')
            ->withPivot('completed_at', 'training_plan_id') // ← вот это добавь!
            ->withTimestamps();
    }


    public function favoriteRecipes()
    {
        return $this->belongsToMany(Recipe::class, 'favorites', 'account_id', 'recipe_id')
            ->withTimestamps();
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function hasCompletedTrainingPlan(TrainingPlan $plan): bool
    {
        $exerciseIdsInPlan = $plan->exercises->pluck('exercise_id')->sort()->values();

        $completedExerciseIds = $this->exercises()
            ->wherePivot('training_plan_id', $plan->training_plan_id)
            ->wherePivotNotNull('completed_at')
            ->pluck('account_exercise.exercise_id')
            ->sort()
            ->values();

        return $exerciseIdsInPlan->all() === $completedExerciseIds->all();
    }


    public function bonuses()
    {
        return $this->belongsToMany(Bonus::class, 'account_bonus', 'account_id', 'bonus_id')
            ->withPivot('received_at')
            ->withTimestamps();
    }

}
