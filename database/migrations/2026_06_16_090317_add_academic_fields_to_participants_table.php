<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->string('generation')->nullable()->after('student_number');
            $table->foreignId('career_id')->nullable()->after('organization_id')->constrained('careers')->nullOnDelete();
            $table->foreignId('current_period_id')->nullable()->after('career_id')->constrained('academic_periods')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropForeign(['career_id']);
            $table->dropForeign(['current_period_id']);
            $table->dropColumn(['generation', 'career_id', 'current_period_id']);
        });
    }
};
