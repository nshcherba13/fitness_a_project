<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Bonus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountBonusController extends Controller
{

    public function index()
    {
        $account = Auth::user()->account;

        $receivedIds = $account->bonuses()->pluck('bonuses.bonus_id')->toArray();

        $claimedBonuses = Bonus::whereIn('bonus_id', $receivedIds)
            ->select('bonus_id', 'title', 'description', 'image', 'valid_until', 'required_fit_points', 'promo_code')
            ->get();

        $availableBonuses = Bonus::whereNotIn('bonus_id', $receivedIds)
            ->select('bonus_id', 'title', 'description', 'image', 'valid_until', 'required_fit_points')
            ->get();

        return response()->json([
            'claimed' => $claimedBonuses,
            'available' => $availableBonuses,
        ]);
    }


    public function show($bonusId)
    {
        $account = Auth::user()->account;

        $bonus = $account->bonuses()->where('bonuses.bonus_id', $bonusId)->first();

        if (!$bonus) {
            return response()->json(['message' => 'Bonus not received'], 403);
        }

        return response()->json([
            'bonus' => $bonus
        ]);
    }

    public function claim($bonusId)
    {
        $account = Auth::user()->account;
        $bonus = Bonus::findOrFail($bonusId);

        $receivedBonusIds = $account->bonuses()->pluck('bonuses.bonus_id')->toArray();

        if (in_array($bonusId, $receivedBonusIds)) {
            return response()->json(['message' => 'Bonus already claimed'], 409);
        }

        if ($account->fit_points < $bonus->required_fit_points) {
            return response()->json(['message' => 'Not enough fit points'], 403);
        }

        $account->fit_points -= $bonus->required_fit_points;
        $account->save();

        $account->bonuses()->attach($bonusId);

        return response()->json([
            'message' => 'Bonus claimed successfully',
            'promo_code' => $bonus->promo_code
        ], 200);
    }

    public function showBonus($bonusId)
    {
        $bonus = Bonus::findOrFail($bonusId);

        return response()->json(['bonus' => $bonus]);
    }
}
