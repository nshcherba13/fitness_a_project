<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Bonus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\Account;
use App\Models\Trainer;
use App\Models\Exercise;
use App\Models\Recipe;
use App\Models\TrainingPlan;

class PhotoUploadController extends Controller
{

    public function storeAccountPhoto(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }


        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');


            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/accounts', $uniqueFileName, 'public');

                $account->profile_picture = $path;
                $account->save();

                return response()->json([
                    'message' => 'Account photo uploaded successfully',
                    'account' => $account,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function updateAccountPhoto(Request $request)
    {
        if (!auth()->user()->account) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $account = Account::where('user_id', $userId)->first();

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($account->profile_picture && $account->profile_picture !== 'images/user.jpg') {
                    Storage::disk('public')->delete($account->profile_picture);
                }
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/accounts', $uniqueFileName, 'public');
                $account->profile_picture = $path;
                $account->save();

                return response()->json([
                    'message' => 'Account photo updated successfully',
                    'account' => $account,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function storeTrainerPhoto(Request $request)
    {
        $id = $request->input('id');
        $trainer = Trainer::find($id);

        if (!$trainer) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/trainers', $uniqueFileName, 'public');

                $trainer->profile_picture = $path;
                $trainer->save();

                return response()->json([
                    'message' => 'Trainer photo uploaded successfully',
                    'trainer' => $trainer,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function updateTrainerPhoto(Request $request)
    {
        $id = $request->input('id');
        $trainer = Trainer::find($id);

        if (!$trainer) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($trainer->profile_picture && $trainer->profile_picture !== 'images/trainer/default_trainer.png') {
                    Storage::delete($trainer->profile_picture);
                }
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/trainers', $uniqueFileName, 'public');
                $trainer->profile_picture = $path;
                $trainer->save();

                return response()->json([
                    'message' => 'Trainer photo updated successfully',
                    'trainer' => $trainer,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function storeExercisePhoto(Request $request)
    {
        $id = $request->input('id');
        $exercise = Exercise::find($id);

        if (!$exercise) {
            return response()->json(['message' => 'Exercise not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/exercises', $uniqueFileName, 'public');
                $exercise->picture = $path;
                $exercise->save();

                return response()->json([
                    'message' => 'Exercise photo uploaded successfully',
                    'exercise' => $exercise,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function updateExercisePhoto(Request $request)
    {
        $id = $request->input('id');
        $exercise = Exercise::find($id);

        if (!$exercise) {
            return response()->json(['message' => 'Exercise not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($exercise->picture && $exercise->picture !== 'images/training/example1.webp') {
                    Storage::delete($exercise->picture);
                }
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/exercises', $uniqueFileName, 'public');
                $exercise->picture = $path;
                $exercise->save();

                return response()->json([
                    'message' => 'Exercise photo updated successfully',
                    'exercise' => $exercise,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function storeRecipePhoto(Request $request)
    {
        $id = $request->input('id');
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/recipes', $uniqueFileName, 'public');
                $recipe->picture = $path;
                $recipe->save();

                return response()->json([
                    'message' => 'Recipe photo uploaded successfully',
                    'recipe' => $recipe,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function updateRecipePhoto(Request $request)
    {
        $id = $request->input('id');
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($recipe->picture && $recipe->picture !== 'images/menu/scrumble.png') {
                    Storage::delete($recipe->picture);
                }

                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/recipes', $uniqueFileName, 'public');
                $recipe->picture = $path;
                $recipe->save();

                return response()->json([
                    'message' => 'Recipe photo updated successfully',
                    'recipe' => $recipe,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function storeTrainingPlanPhoto(Request $request)
    {
        $id = $request->input('id');
        $trainingPlan = TrainingPlan::find($id);

        if (!$trainingPlan) {
            return response()->json(['message' => 'Training plan not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/training_plans', $uniqueFileName, 'public');
                $trainingPlan->picture = $path;
                $trainingPlan->save();

                return response()->json([
                    'message' => 'Training plan photo uploaded successfully',
                    'training_plan' => $trainingPlan,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }


    public function updateTrainingPlanPhoto(Request $request)
    {
        $id = $request->input('id');
        $trainingPlan = TrainingPlan::find($id);

        if (!$trainingPlan) {
            return response()->json(['message' => 'Training plan not found'], 404);
        }

        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($trainingPlan->picture && $trainingPlan->picture !== 'images/training/example1.webp') {
                    Storage::delete($trainingPlan->picture);
                }
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/training_plans', $uniqueFileName, 'public');
                $trainingPlan->picture = $path;
                $trainingPlan->save();

                return response()->json([
                    'message' => 'Training plan photo updated successfully',
                    'training_plan' => $trainingPlan,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }

    public function storeBonusPhoto(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'id' => 'required|exists:bonuses,bonus_id', // важно: ожидаем ID бонуса
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');

            if ($photo->isValid()) {
                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/bonuses', $uniqueFileName, 'public');

                $bonusId = $request->input('id');
                $bonus = Bonus::find($bonusId);

                if (!$bonus) {
                    return response()->json(['message' => 'Bonus not found'], 404);
                }

                $bonus->image = $path;
                $bonus->save();

                return response()->json([
                    'message' => 'Bonus photo uploaded successfully',
                    'bonus' => $bonus,
                ], 201);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }

    public function updateBonusPhoto(Request $request)
    {
        if (!auth()->user()->admin) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $bonusId = $request->input('id');
        $bonus = Bonus::find($bonusId);

        if (!$bonus) {
            return response()->json(['message' => 'Bonus not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            if ($photo->isValid()) {
                if ($bonus->image && $bonus->image !== 'images/bonuses/default_bonus.jpg') {
                    Storage::disk('public')->delete($bonus->image);
                }

                $uniqueFileName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('images/bonuses', $uniqueFileName, 'public');

                $bonus->image = $path;
                $bonus->save();

                return response()->json([
                    'message' => 'Bonus photo updated successfully',
                    'bonus' => $bonus,
                ], 200);
            }
        }

        return response()->json(['message' => 'File not valid or not found'], 400);
    }
}
