<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            SubscriptionsSeeder::class,
            AdminSeeder::class,
            RecipeSeeder::class,
            AccountSeeder::class,
            FavoritesSeeder::class,
            TrainerSeeder::class,
            MessagesSeeder::class,
            ExerciseSeeder::class,
            AccountExerciseSeeder::class,
            TrainingPlanSeeder::class,
            AccountTrainingPlanSeeder::class,
            ExerciseTrainingPlanSeeder::class,
        ]);
    }
}
