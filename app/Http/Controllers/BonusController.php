<?php

namespace App\Http\Controllers;

use App\Models\Bonus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BonusController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = Bonus::with('creator');

        if (!auth()->user()->admin) {
            $query->where('valid_until', '>=', now());
        }

        $bonuses = $query->get();

        return response()->json([
            'bonuses' => $bonuses
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'required_fit_points' => 'required|integer|min:0',
            'promo_code' => 'required|string|max:255',
            'valid_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $bonus = Bonus::create([
            'title' => $request->title,
            'description' => $request->description,
            'required_fit_points' => $request->required_fit_points,
            'promo_code' => $request->promo_code,
            'valid_until' => $request->valid_until,
            'created_by' => Auth::user()->admin->admin_id,
        ]);

        return response()->json([
            'message' => 'Bonus created successfully',
            'bonus' => $bonus
        ], 201);
    }

    public function show($id)
    {
        $bonus = Bonus::with('creator')->findOrFail($id);

        return response()->json([
            'bonus' => $bonus
        ]);
    }

    public function update(Request $request, $id)
    {
        $bonus = Bonus::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'required_fit_points' => 'sometimes|required|integer|min:0',
            'promo_code' => 'sometimes|required|string|max:255',
            'valid_until' => 'sometimes|required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $bonus->update($request->only([
            'title',
            'description',
            'required_fit_points',
            'promo_code',
            'valid_until',
        ]));

        return response()->json([
            'message' => 'Bonus updated successfully',
            'bonus' => $bonus->fresh()
        ]);
    }

    public function destroy($id)
    {
        $bonus = Bonus::findOrFail($id);
        $bonus->delete();

        return response()->json([
            'message' => 'Bonus deleted successfully'
        ]);
    }
}
