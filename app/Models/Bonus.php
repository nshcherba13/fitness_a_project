<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bonus extends Model
{
    use HasFactory;

    protected $primaryKey = 'bonus_id';

    protected $fillable = [
        'title',
        'description',
        'required_fit_points',
        'promo_code',
        'image',
        'valid_until',
        'created_by'
    ];

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by', 'admin_id');
    }

    public function accounts()
    {
        return $this->belongsToMany(Account::class, 'account_bonus', 'bonus_id', 'account_id')
            ->withPivot('received_at')
            ->withTimestamps();
    }
}
