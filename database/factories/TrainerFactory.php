<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trainer>
 */
class TrainerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->withFullName()->create();
        return [
            'user_id' => $user->id,
            'first_name' => explode(' ', $user->name)[0],
            'last_name' => explode(' ', $user->name)[1],
            'expertise' => $this->faker->word(),
            'bio' => $this->faker->paragraph(),
            'profile_picture' => 'images/trainer/default_trainer.png',
        ];
    }
}
