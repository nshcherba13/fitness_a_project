<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Admin;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrainingPlan>
 */
class TrainingPlanFactory extends Factory
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
            'goal' => $this->faker->randomElement(['gain_weight', 'lose_weight', 'maintain_fitness']),
            'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'created_by' => $this->faker->randomElement($adminIds),
            'picture' => 'images/training/example1.webp',
        ];
    }
}
