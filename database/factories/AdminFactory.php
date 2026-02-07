<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
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
            'profile_picture' => 'images/admin.jpg',
            'last_login' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
