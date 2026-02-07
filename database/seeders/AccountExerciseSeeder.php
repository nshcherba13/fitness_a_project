<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Account;
use App\Models\Exercise;

class AccountExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accountIds = Account::pluck('account_id')->toArray();
        $exerciseIds = Exercise::pluck('exercise_id')->toArray();

        foreach (range(1, 10) as $index) {
            DB::table('account_exercise')->insert([
                'account_id' => $accountIds[array_rand($accountIds)],
                'exercise_id' => $exerciseIds[array_rand($exerciseIds)],
                'completed_at' => now()->subDays(rand(1, 365)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
