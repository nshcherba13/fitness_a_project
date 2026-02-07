<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use Illuminate\Support\Facades\Auth;

class FavoritesController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|exists:recipes,recipe_id',
        ]);

        $user = Auth::user();
        $accountId = $user->account->account_id;

        $recipe = Recipe::findOrFail($request->recipe_id);

        if ($recipe->favoritedByAccounts()->where('favorites.account_id', $accountId)->exists()) {
            $recipe->favoritedByAccounts()->detach($accountId);
            return response()->json([
                'message' => 'Recipe removed from favorites',
            ]);
        } else {
            $recipe->favoritedByAccounts()->attach($accountId);
            return response()->json([
                'message' => 'Recipe successfully added to favorites',
            ], 201);
        }
    }

    public function showUserFavs()
    {
        $user = Auth::user();

        $accountId = $user->account->account_id;

        $favourites = Recipe::whereHas('favoritedByAccounts', function ($query) use ($accountId) {
            $query -> where('favorites.account_id', $accountId);})->get();

        return response()->json([
            'favourites' => $favourites,
        ]);
    }

    public function destroyFavorite(Request $request, $recipeId){

        $user = Auth::user();

        $accountId = $user->account->account_id;

        $recipe = Recipe::findOrFail($recipeId);

        $recipe->favoritedByAccounts()->detach($accountId);

        return response()->json([
            'message' => 'Recipe successfully removed from favorites',
        ]);
    }
}
