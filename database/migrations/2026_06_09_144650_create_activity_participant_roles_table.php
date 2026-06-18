<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_participant_roles', function (Blueprint $table) {
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('participant_roles')->cascadeOnDelete();
            $table->primary(['participant_id', 'activity_id', 'role_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_participant_roles');
    }
};
