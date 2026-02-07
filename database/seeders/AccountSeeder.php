<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Account;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $usersForAccounts = User::factory(10)->create();

        foreach ($usersForAccounts as $user) {
            Account::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        $standardUser = User::factory()->create([
            'email' => 'user@user.com',
        ]);

        Account::factory()->create([
            'user_id' => $standardUser->id,
        ]);
    }
}

