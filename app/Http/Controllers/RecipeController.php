<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|string',
            'cooking_time' => 'required|integer|min:1',
            'calories' => 'required|integer|min:0',
            'category' => 'required|string|max:100',
        ]);


        $validated['created_by'] = $request->user()->id ?? 'Admin';

        $recipe = Recipe::create($validated);

        return response()->json([
            'message' => 'Recipe created successfully',
            'recipe' => $recipe,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showRecipesList()
    {
        $recipes = Recipe::all();

        return response()->json([
            'recipes' => $recipes,
        ], 200);
    }

    public function show(string $id)
    {
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        return response()->json([
            'recipe' => $recipe,
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'ingredients' => 'sometimes|required|string',
            'cooking_time' => 'sometimes|required|integer|min:1',
            'calories' => 'sometimes|required|integer|min:0',
            'category' => 'sometimes|required|string|max:100',
        ]);

        $recipe = Recipe::findOrFail($id);


        $recipe->update($validated);

        return response()->json([
            'message' => 'Recipe updated successfully',
            'recipe' => $recipe->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recipe = Recipe::findOrFail($id);

        $recipe->delete();

        return response()->json([
            'message' => 'Recipe deleted successfully',
        ], 200);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['message' => 'Query parameter is required'], 400);
        }

        $recipes = Recipe::where('title', 'like', '%' . $query . '%')->get();

        return response()->json([
            'recipes' => $recipes,
        ], 200);
    }
}
