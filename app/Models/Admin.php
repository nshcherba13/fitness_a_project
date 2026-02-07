<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Model
{
    use HasFactory;
    protected $table = 'admins';

    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'last_login',
        'profile_picture',
    ];

    public function trainingPlans()
    {
        return $this->hasMany(TrainingPlan::class, 'created_by');
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class, 'created_by');
    }

    public function recipes(){
        return $this->hasMany(Recipe::class, 'created_by');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function bonusesCreated()
    {
        return $this->hasMany(Bonus::class, 'created_by', 'admin_id');
    }
}
