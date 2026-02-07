<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('subscriptions')->insert([
            [
                'name' => 'Bronze',
                'price' => '0',
                'description' => 'Free plan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Silver',
                'price' => '19',
                'description' => 'Basis plan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gold',
                'price' => '29',
                'description' => 'Premium plan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
