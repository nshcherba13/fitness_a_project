<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Exercise extends Model
{
    use HasFactory;

    protected $primaryKey = 'exercise_id';

    protected $fillable = [
        'name',
        'video_url',
        'description',
        'picture',
        'created_by',
    ];

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_exercise', 'exercise_id', 'account_id')
            ->withPivot('completed_at'); //time of finish

    }


    public function trainingPlans()
    {
        return $this->belongsToMany(TrainingPlan::class, 'exercise_training_plan', 'exercise_id', 'training_plan_id');
    }

}
