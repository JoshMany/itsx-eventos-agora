<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_speaker', function (Blueprint $table) {
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignId('speaker_id')->constrained('speakers')->cascadeOnDelete();
            $table->primary(['activity_id', 'speaker_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_speaker');
    }
};
