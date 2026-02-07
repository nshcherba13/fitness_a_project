<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Trainer;

class TrainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        Trainer::factory()->count(3)->create();


        $user = User::factory()->create([
            'email' => 'trainer@trainer.com',
        ]);

        Trainer::create([
            'user_id' => $user->id,
            'first_name' => 'Trainer',
            'last_name' => 'User',
            'expertise' => 'Default Expertise',
            'profile_picture' => 'images/trainer/default_trainer.png',
        ]);

    }
}
