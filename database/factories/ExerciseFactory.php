<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Admin;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exercise>
 */
class ExerciseFactory extends Factory
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
            'video_url' => 'https://www.youtube.com/watch?v=FeR-4_Opt-g',
            'name'=> $this->faker->text(10),
            'description' => $this->faker->text(200),
            'created_by' => $this->faker->randomElement($adminIds),
            'picture' => 'images/training/example1.webp',
        ];
    }
}
