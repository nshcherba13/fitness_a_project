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
        Schema::create('training_plans', function (Blueprint $table) {
            $table->id('training_plan_id');
            $table->string('title');
            $table->text('description');
            $table->enum('goal', ['gain_weight', 'lose_weight', 'maintain_fitness']);
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->timestamps();
            $table->string('picture')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')
                ->references('admin_id')->on('admins')
                ->onDelete('cascade');
        });

        Schema::create('account_training_plan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('training_plan_id');

            $table->foreign('account_id')
                ->references('account_id')->on('accounts')
                ->onDelete('cascade');

            $table->foreign('training_plan_id')
                ->references('training_plan_id')->on('training_plans')
                ->onDelete('cascade');
        });

        Schema::create('exercise_training_plan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exercise_id');
            $table->unsignedBigInteger('training_plan_id');
            $table->timestamps();

            $table->foreign('exercise_id')
                ->references('exercise_id')->on('exercises')
                ->onDelete('cascade');
            $table->foreign('training_plan_id')
                ->references('training_plan_id')->on('training_plans')
                ->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_training_plan');
        Schema::dropIfExists('account_training_plan');
        Schema::dropIfExists('training_plans');
    }

};
