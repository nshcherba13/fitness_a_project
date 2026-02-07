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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id('recipe_id');
            $table->string('title');
            $table->text('description');
            $table->text('ingredients');
            $table->integer('cooking_time');
            $table->integer('calories');
            $table->string('category');
            $table->string('picture')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')
                ->references('admin_id')->on('admins')
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
        Schema::dropIfExists('recipes');
    }

};
