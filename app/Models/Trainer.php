<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Trainer extends Model
{
    protected $primaryKey = 'id';
    use HasFactory;
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'expertise',
        'bio',
        'profile_picture',
    ];

    // Beziehungen für Messages
    public function sentMessages()
    {
        return $this->morphMany(Message::class, 'sender');
    }

    public function receivedMessages()
    {
        return $this->morphMany(Message::class, 'receiver');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
