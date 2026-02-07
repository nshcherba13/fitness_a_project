<?php

use App\Http\Controllers\AccountBonusController;
use App\Http\Controllers\AccountExerciseController;
use App\Http\Controllers\AccountTrainingsPlanController;
use App\Http\Controllers\BonusController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\TrainingPlanExerciseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FavoritesController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\TrainingPlanController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Routen für accounts
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/accounts', [AccountController::class, 'index']);
    Route::get('/accounts/show', [AccountController::class, 'show']);

    Route::put('/account/update', [AccountController::class, 'update']);
    Route::delete('/account/destroy', [AccountController::class, 'destroy']);
    Route::get('/account/showUsersToTrainers', [AccountController::class, 'showUsersToTrainers']);
    Route::get('/account/info', [AccountController::class, 'showInfo']); //Changed here to account, was: accountS

    Route::get('/account/training-plans', [AccountController::class, 'showAvailableTrainingPlans']);
    Route::get('/account/can-write-to-trainer', [AccountController::class, 'canWriteToTrainer']);
    Route::put('/account/update-subscription', [AccountController::class, 'updateSubscription']);
});

// Routen für admins
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/info', [AdminController::class, 'show']);
    Route::get('/admin/find', [AdminController::class, 'findAnotherAdmin']);
    Route::post('/admin/send-email', [AdminController::class, 'sendEmails']);
    Route::get('/admin/statistics', [AdminController::class, 'getStatistics']);
});

// Routen für trainers
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/trainers', [TrainerController::class, 'index']);
    Route::get('/trainers/show', [TrainerController::class, 'show']);
    Route::put('/trainers/update', [TrainerController::class, 'update']);
    Route::delete('/trainers/destroy', [TrainerController::class, 'destroy']);
    Route::get('/trainers/ID',[TrainerController::class,'showTrainersID']);
    Route::get('/trainer/info', [TrainerController::class, 'showInfo']);
    Route::get('/trainers-to-users', [TrainerController::class, 'showTrainersToUsers']);
});


// Routen für subscriptions
Route::apiResource('subscriptions', SubscriptionController::class);
Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);
Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
Route::get('/subscriptions/name/{name}', [SubscriptionController::class, 'getSubscriptionByName']);


// Routen für Messages
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('messages', MessagesController::class);
    Route::get('/between/user/{accountId}/trainer/{trainerId}', [MessagesController::class, 'getAllMessagesInChat']);
    Route::get('/messages/user/{userId}', [MessagesController::class, 'getUserMessages']);
    Route::get('/messages/trainer/{trainerId}', [MessagesController::class, 'getTrainerMessages']);
    Route::get('/trainerIds', [MessagesController::class, 'trainerIds']);
    Route::get('/userIds', [MessagesController::class, 'userIds']);
    Route::get('/userIDWithMessageLast', [MessagesController::class, 'userIDWithMessageLast']);
    Route::post('/messages/last', [MessagesController::class, 'showLastMessage']);
});



// Routen für Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/register/trainer', [AuthController::class, 'createTrainer']); // only for admins
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout/all', [AuthController::class, 'logoutFromAllDevices']);
    Route::post('/register/admin', [AuthController::class, 'createAdmin']); // for test only! MUST BE DELETED
});

//Routen für Favorites
Route::middleware('auth:sanctum')->group(function () {
    Route::post('recipes/favorites', [FavoritesController::class, 'store'])->name('favorites.store');
    Route::get('recipes/favorites', [FavoritesController::class, 'showUserFavs'])->name('favorites.show');
    Route::delete('recipes/favorites/{recipeId}', [FavoritesController::class, 'destroyFavorite'])->name('favorites.destroy');
});

//Routen für AcccountTrainingsPlan
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/training-plan', [AccountTrainingsPlanController::class, 'show'])
        ->name('trainingPlan.show');
    Route::post('/training-plan/{trainingPlanId}/complete', [AccountTrainingsPlanController::class, 'completePlan']);

    Route::post('/training-plan', [AccountTrainingsPlanController::class, 'store'])
        ->name('trainingPlan.store');
    Route::delete('/training-plan/{training_plan_id}', [AccountTrainingsPlanController::class, 'destroy'])
        ->name('trainingPlan.destroy');
});

// Routen für TrainingPlanExercise
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/training-plans/{training_plan_id}/exercises', [TrainingPlanExerciseController::class, 'show'])
        ->name('trainingPlans.exercises.show');
    Route::put('/training-plans/{training_plan_id}/exercises', [TrainingPlanExerciseController::class, 'update'])
        ->name('trainingPlans.exercises.update');
    Route::post('/training-plans/{training_plan_id}/exercises/{exercise_id}/finish', [AccountExerciseController::class, 'finishExercise'])
        ->name('trainingPlan.exercises.finish');
    Route::delete('/training-plans/{training_plan_id}/exercises/{exercise_id}', [TrainingPlanExerciseController::class, 'removeExercise'])
        ->name('trainingPlans.exercises.remove');
});


// Routen für Exercises
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/exercises', [ExerciseController::class, 'showExercisesList']);
    Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']);
});

// Routen für Recipes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/recipes/search', [RecipeController::class, 'search']);
    Route::get('/recipes', [RecipeController::class, 'showRecipesList']);
    Route::get('/recipes/{id}', [RecipeController::class, 'show']);
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{id}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/bonuses', [BonusController::class, 'index']);
        Route::post('/bonuses', [BonusController::class, 'store']);
        Route::get('/bonuses/{id}', [BonusController::class, 'show']);
        Route::put('/bonuses/{id}', [BonusController::class, 'update']);
        Route::delete('/bonuses/{id}', [BonusController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/account/bonuses', [AccountBonusController::class, 'index']);
    Route::get('/account/bonus/{bonusId}', [AccountBonusController::class, 'showBonus']);
    Route::get('/account/bonuses/{bonusId}', [AccountBonusController::class, 'show']);
    Route::post('/account/bonuses/{bonusId}/claim', [AccountBonusController::class, 'claim']);
});

// Routen für Training Plans
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/training-plans/recommended', [TrainingPlanController::class, 'getRecommendedPlans']);
    Route::get('/training-plans/filter', [TrainingPlanController::class, 'filter']);
    Route::get('/training-plans/search', [TrainingPlanController::class, 'search']);
    Route::get('/training-plans', [TrainingPlanController::class, 'showTrainingPlansList']);
    Route::get('/training-plans/{id}', [TrainingPlanController::class, 'show']);
    Route::post('/training-plans', [TrainingPlanController::class, 'store']);
    Route::put('/training-plans/{id}', [TrainingPlanController::class, 'update']);
    Route::delete('/training-plans/{id}', [TrainingPlanController::class, 'destroy']);
});


use App\Http\Controllers\PhotoUploadController;
// Routen für Photo-Update
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/account/photo', [PhotoUploadController::class, 'storeAccountPhoto']);
    Route::post('/account/photo/update', [PhotoUploadController::class, 'updateAccountPhoto']);

    Route::post('/trainer/photo', [PhotoUploadController::class, 'storeTrainerPhoto']);
    Route::post('/trainer/photo/update', [PhotoUploadController::class, 'updateTrainerPhoto']);

    Route::post('/exercise/photo', [PhotoUploadController::class, 'storeExercisePhoto']);
    Route::post('/exercise/photo/update', [PhotoUploadController::class, 'updateExercisePhoto']);

    Route::post('/recipe/photo', [PhotoUploadController::class, 'storeRecipePhoto']);
    Route::post('/recipe/photo/update', [PhotoUploadController::class, 'updateRecipePhoto']);

    Route::post('/training-plan/photo', [PhotoUploadController::class, 'storeTrainingPlanPhoto']);
    Route::post('/training-plan/photo/update', [PhotoUploadController::class, 'updateTrainingPlanPhoto']);

    Route::post('/bonus/photo', [PhotoUploadController::class, 'storeBonusPhoto']);
    Route::post('/bonus/photo/update', [PhotoUploadController::class, 'updateBonusPhoto']);
});


