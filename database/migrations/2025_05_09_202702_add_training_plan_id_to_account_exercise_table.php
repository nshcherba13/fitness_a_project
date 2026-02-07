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
        Schema::table('account_exercise', function (Blueprint $table) {
            Schema::table('account_exercise', function (Blueprint $table) {
                $table->unsignedBigInteger('training_plan_id')->nullable()->after('account_id');

                $table->foreign('training_plan_id')
                    ->references('training_plan_id')
                    ->on('training_plans')
                    ->onDelete('cascade');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_exercise', function (Blueprint $table) {
            Schema::table('account_exercise', function (Blueprint $table) {
                $table->dropForeign(['training_plan_id']);
                $table->dropColumn('training_plan_id');
            });
        });
    }
};
