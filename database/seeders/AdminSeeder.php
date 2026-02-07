<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Admin::factory()->count(2)->create();

        $user = User::factory()->create([
            'email' => 'admin@admin.com',
        ]);

        Admin::create([
            'user_id' => $user->id,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'profile_picture' => 'images/admin.jpg',
        ]);
    }
}
