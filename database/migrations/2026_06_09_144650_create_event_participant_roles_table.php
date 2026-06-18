<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_participant_roles', function (Blueprint $table) {
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('participant_roles')->cascadeOnDelete();
            $table->primary(['participant_id', 'event_id', 'role_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_participant_roles');
    }
};
