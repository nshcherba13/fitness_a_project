<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Exercise;
use App\Models\TrainingPlan;

class ExerciseTrainingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exerciseIds = Exercise::pluck('exercise_id')->toArray();
        $trainingPlanIds = TrainingPlan::pluck('training_plan_id')->toArray();

        foreach (range(1, 10) as $index) {
            DB::table('exercise_training_plan')->insert([
                'exercise_id' => $exerciseIds[array_rand($exerciseIds)],
                'training_plan_id' => $trainingPlanIds[array_rand($trainingPlanIds)], 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
