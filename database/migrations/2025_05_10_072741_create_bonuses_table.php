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
        Schema::create('bonuses', function (Blueprint $table) {
            $table->id('bonus_id');
            $table->string('title');
            $table->text('description');
            $table->integer('required_fit_points');
            $table->string('promo_code');
            $table->string('image')->nullable();
            $table->date('valid_until');

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
        Schema::dropIfExists('bonuses');
    }
};
