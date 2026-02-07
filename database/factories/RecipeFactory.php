<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Admin;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $adminIds = Admin::pluck('admin_id')->toArray();
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'ingredients' => $this->faker->text(200),
            'cooking_time' => $this->faker->numberBetween(10, 120),
            'calories' => $this->faker->numberBetween(50, 1000),
            'category' => $this->faker->word(),
            'created_by' => $this->faker->randomElement($adminIds),
            'picture' => 'images/menu/scrumble.png',
        ];
    }
}
