<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Account;
use App\Models\Recipe;

class FavoritesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accountIds = Account::pluck('account_id')->toArray();
        $recipeIds = Recipe::pluck('recipe_id')->toArray();

        foreach (range(1, 10) as $index) {
            DB::table('favorites')->insert([
                'account_id' => $accountIds[array_rand($accountIds)], 
                'recipe_id' => $recipeIds[array_rand($recipeIds)], 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

