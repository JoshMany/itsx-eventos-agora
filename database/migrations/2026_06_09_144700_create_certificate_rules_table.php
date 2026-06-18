<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_type_id')->constrained('certificate_types')->cascadeOnDelete();
            $table->string('rule_type');
            $table->json('conditions')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_rules');
    }
};
