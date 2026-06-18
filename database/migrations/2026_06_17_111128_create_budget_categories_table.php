<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->timestamps();
        });

        Schema::table('event_expenses', function (Blueprint $table) {
            $table->foreignId('budget_category_id')->nullable()->after('event_id')->constrained('budget_categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('event_expenses', function (Blueprint $table) {
            $table->dropForeign(['budget_category_id']);
            $table->dropColumn('budget_category_id');
        });

        Schema::dropIfExists('budget_categories');
    }
};
