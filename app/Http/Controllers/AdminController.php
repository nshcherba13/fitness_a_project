<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Bonus;
use App\Models\Exercise;
use App\Models\Recipe;
use App\Models\Trainer;
use App\Models\TrainingPlan;
use App\Models\User;
use Illuminate\Http\Request;

use App\Models\Admin;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{

    public function show(Request $request)
    {

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $admin = Admin::where('user_id', $userId)->first();

        if (!$admin) {
            return response()->json(['message' => 'No associated account found'], 403);
        }

        return response()->json([
            'admin' => [
                'admin_id' => $admin->admin_id,
                'user_id' => $admin->user_id,
                'first_name' => $admin->first_name,
                'last_name' => $admin->last_name,
                'last_login' => $admin->last_login,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
                'profile_picture' => $admin->profile_picture,
            ],
        ], 200);
    }

    public function findAnotherAdmin(Request $request)
    {

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $id = $request->input('id');
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        return response()->json([
            'admin' => [
                'admin_id' => $admin->admin_id,
                'user_id' => $admin->user_id,
                'first_name' => $admin->first_name,
                'last_name' => $admin->last_name,
                'last_login' => $admin->last_login,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
                'profile_picture' => $admin->profile_picture,
            ],
        ], 200);
    }

    public function sendEmails(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validated = $request->validate([
            'groups' => 'required|array',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $groups = $validated['groups'];
        $subject = $validated['subject'];
        $message = $validated['message'];

        $emails = [];

        if (in_array('Admins', $groups)) {
            $adminEmails = User::whereIn('id', Admin::pluck('user_id'))->pluck('email')->toArray();
            $emails = array_merge($emails, $adminEmails);
        }

        if (in_array('Users', $groups)) {
            $userEmails = User::whereIn('id', Account::pluck('user_id'))->pluck('email')->toArray();
            $emails = array_merge($emails, $userEmails);
        }

        if (in_array('Trainers', $groups)) {
            $trainerEmails = User::whereIn('id', Trainer::pluck('user_id'))->pluck('email')->toArray();
            $emails = array_merge($emails, $trainerEmails);
        }

        $emails = array_unique($emails);

        foreach ($emails as $email) {
            Mail::raw($message, function ($mail) use ($email, $subject) {
                $mail->to($email)
                    ->from('newsletter@taem-a.com', 'Team-A Newsletters')
                    ->subject($subject);
            });
        }

        return response()->json(['message' => 'Emails sent successfully'], 200);
    }

    public function getStatistics()
    {
        $subscriptionCounts = Account::selectRaw('subscription_id, COUNT(*) as count')
            ->with('subscription:subscription_id,name')
            ->groupBy('subscription_id')
            ->get();

        $totalRecipes = Recipe::count();
        $totalPlans = TrainingPlan::count();
        $totalExercises = Exercise::count();
        $totalBonuses = Bonus::count();

        return response()->json([
            'subscriptions' => $subscriptionCounts,
            'total_recipes' => $totalRecipes,
            'total_plans' => $totalPlans,
            'total_exercises' => $totalExercises,
            'total_bonuses' => $totalBonuses,
        ]);
    }
}
