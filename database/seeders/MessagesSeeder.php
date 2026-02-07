<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
//use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Account;
use App\Models\Trainer;
use App\Models\Message;
class MessagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Holen Sie sich zwei existierende Benutzer (zum Testen)
        // Erstellt 10 Benutzer und 5 Trainer
        // Generiere 50 Nachrichten
        foreach (range(1, 50) as $i) {
            // Zufälliger Sender (User oder Trainer)
            $sender = rand(0, 1) ? Account::inRandomOrder()->first() : Trainer::inRandomOrder()->first();
            $senderType = $sender instanceof Account ? 'Account' : 'Trainer';
            if ($senderType=='Account'){
                $receiver = Trainer::inRandomOrder()->first();
            }elseif($senderType=='Trainer'){
                $receiver = Account::inRandomOrder()->first();
            }
            $receiverType = $receiver instanceof Account ? 'Account' : 'Trainer';
            if ($senderType=='Account'&&$receiverType=='Trainer'){
            // Nachricht erstellen
            Message::create([
                'sender_id' => $sender->account_id,
                'sender_type' => $senderType,
                'receiver_id' => $receiver->id,
                'receiver_type' => $receiverType,
                'content' => fake()->sentence(),
                'timestamp' => now(),
            ]);
            }elseif($senderType=='Trainer'&&$receiverType=='Account'){
            // Nachricht erstellen
            Message::create([
                'sender_id' => $sender->id,
                'sender_type' => $senderType,
                'receiver_id' => $receiver->account_id,
                'receiver_type' => $receiverType,
                'content' => fake()->sentence(),
                'timestamp' => now(),
            ]);
            }elseif($senderType=='Account'&&$receiverType=='Account'){
                // Nachricht erstellen
                Message::create([
                    'sender_id' => $sender->account_id,
                    'sender_type' => $senderType,
                    'receiver_id' => $receiver->account_id,
                    'receiver_type' => $receiverType,
                    'content' => fake()->sentence(),
                    'timestamp' => now(),
                ]);
            }elseif($senderType=='Trainer'&&$receiverType=='Trainer'){
                dump($senderType);
                dump($receiverType);
                info('Trainer count: ' . $receiverType);
                // Nachricht erstellen
                Message::create([
                    'sender_id' => $sender->id,
                    'sender_type' => $senderType,
                    'receiver_id' => $receiver->id,
                    'receiver_type' => $receiverType,
                    'content' => fake()->sentence(),
                    'timestamp' => now(),
                ]);
            }

        }
    }
}
