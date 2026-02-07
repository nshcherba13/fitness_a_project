<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Recipe;
use App\Models\Admin;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        if (Admin::count() === 0) {
            Admin::factory()->count(3)->create();
        }

        Recipe::factory()->count(10)->create();
    }
}
