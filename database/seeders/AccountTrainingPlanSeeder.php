<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Account;
use App\Models\TrainingPlan;

class AccountTrainingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accountIds = Account::pluck('account_id')->toArray();
        $trainingPlanIds = TrainingPlan::pluck('training_plan_id')->toArray();

        foreach (range(1, 10) as $index) {
            DB::table('account_training_plan')->insert([
                'account_id' => $accountIds[array_rand($accountIds)],
                'training_plan_id' => $trainingPlanIds[array_rand($trainingPlanIds)],
            ]);
        }
    }
}
