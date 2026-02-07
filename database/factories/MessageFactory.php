<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
        
        // Zufällig einen Sender (User oder Trainer) auswählen
        $senderType = $this->faker->randomElement(['Account', 'Trainer']);
        $sender = $senderType === 'Account' ? Account::factory()->create() : Trainer::factory()->create();

        // Zufällig einen Empfänger (User oder Trainer) auswählen, der nicht der Sender ist
        do {
            $receiverType = $this->faker->randomElement(['Account', 'Trainer']);
            $receiver = $receiverType === 'Account' ? Account::factory()->create() : Trainer::factory()->create();

        } while ($receiver->id === $sender->id && $senderType === $receiverType);

        return [
            'sender_id' => $sender->id,
            'sender_type' => $senderType,
            'receiver_id' => $receiver->id,
            'receiver_type' => $receiverType,
            'content' => $this->faker->sentence(),
            'timestamp' => $this->faker->dateTimeBetween('-1 years', 'now'),
        ];
    }
}
