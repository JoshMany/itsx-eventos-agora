<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_sponsors', function (Blueprint $table) {
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('sponsor_id')->constrained('sponsors')->cascadeOnDelete();
            $table->string('contribution_type');
            $table->decimal('amount', 12, 2)->nullable();
            $table->text('description')->nullable();
            $table->primary(['event_id', 'sponsor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_sponsors');
    }
};
