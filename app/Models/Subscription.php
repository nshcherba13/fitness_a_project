<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $primaryKey = 'subscription_id';

    protected $fillable = [
        'name',
        'price',
        'description',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class, 'subscription_id', 'subscription_id');
    }

}
