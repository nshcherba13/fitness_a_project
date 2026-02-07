<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'registration_date' => $this->faker->date(),
            'age' => $this->faker->numberBetween(18, 80),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'fitness_level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'weight' => $this->faker->numberBetween(50, 250),
            'height' => $this->faker->numberBetween(150, 220),
            'subscription_id' => $this->faker->numberBetween(1, 3),
            'profile_picture' => 'images/user.jpg',
        ];
    }
}
