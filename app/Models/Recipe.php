<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Recipe extends Model
{
    use HasFactory;

    protected $primaryKey = 'recipe_id';

    protected $fillable = [
        'title',
        'description',
        'ingredients',
        'cooking_time',
        'calories',
        'category',
        'picture',
        'created_by',
    ];

    public function favoritedByAccounts()
    {
        return $this->belongsToMany(Account::class, 'favorites', 'recipe_id', 'account_id')
            ->withTimestamps();
    }

}
