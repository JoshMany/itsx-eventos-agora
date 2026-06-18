<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('name', 'title');
            $table->text('short_description')->nullable()->after('title');
            $table->integer('capacity')->nullable()->after('description');
            $table->timestamp('registration_starts_at')->nullable()->after('ends_at');
            $table->timestamp('registration_ends_at')->nullable()->after('registration_starts_at');
            $table->foreignId('venue_id')->nullable()->after('registration_ends_at')->constrained('venues')->nullOnDelete();
            $table->foreignId('room_id')->nullable()->after('venue_id')->constrained('rooms')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->after('room_id')->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->timestamp('published_at')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropColumn('venue_id');
            $table->dropForeign(['room_id']);
            $table->dropColumn('room_id');
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
            $table->dropForeign(['approved_by']);
            $table->dropColumn('approved_by');
            $table->dropColumn(['short_description', 'capacity', 'registration_starts_at', 'registration_ends_at', 'approved_at', 'published_at']);
            $table->renameColumn('title', 'name');
        });
    }
};
