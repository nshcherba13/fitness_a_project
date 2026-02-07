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
        Schema::create('exercises', function (Blueprint $table) {
            $table->id('exercise_id');
            $table->string('name');
            $table->string('video_url');
            $table->text('description');
            $table->timestamps();
            $table->string('picture')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')
                ->references('admin_id')->on('admins')
                ->onDelete('cascade');
        });

        Schema::create('account_exercise', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('exercise_id');
            $table->date('completed_at');
            $table->timestamps();

            $table->foreign('account_id')
                ->references('account_id')->on('accounts')
                ->onDelete('cascade');

            $table->foreign('exercise_id')
                ->references('exercise_id')->on('exercises')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_exercise');
        Schema::dropIfExists('exercises');
    }

};
