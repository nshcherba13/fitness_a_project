<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $fillable = ['sender_id', 'sender_type','receiver_id', 'receiver_type', 'content', 'timestamp'];
    public function sender()
{
    return $this->morphTo();
}

public function receiver()
{
    return $this->morphTo();
}


}
