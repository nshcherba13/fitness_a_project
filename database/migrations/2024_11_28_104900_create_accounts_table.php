<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id('account_id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->date('registration_date');
            $table->unsignedTinyInteger('age'); // years tiny int 0 to 255
            $table->enum('gender', ['male', 'female', 'other']);
            $table->enum('fitness_level', ['beginner', 'intermediate', 'advanced']);
            $table->unsignedSmallInteger('weight'); // kg small int 0 to 65535
            $table->unsignedSmallInteger('height'); // cm small int 0 to 65535
            $table->timestamps(); //created_at updated_at
            $table->unsignedBigInteger('subscription_id')->nullable();
            $table->string('profile_picture')->nullable();

            $table->foreign('subscription_id')
                ->references('subscription_id')
                ->on('subscriptions')
                ->onDelete('set null');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

        });
        Schema::create('favorites', function (Blueprint $table) {
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('recipe_id');
            $table->foreign('account_id')
                ->references('account_id')->on('accounts')
                ->onDelete('cascade');

            $table->foreign('recipe_id')
                ->references('recipe_id')->on('recipes')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('account_training_plan');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('account');
    }

};
