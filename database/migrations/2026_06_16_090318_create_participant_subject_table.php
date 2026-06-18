<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participant_subject', function (Blueprint $table) {
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('professor_id')->nullable()->constrained('professors')->nullOnDelete();
            $table->primary(['participant_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participant_subject');
    }
};
