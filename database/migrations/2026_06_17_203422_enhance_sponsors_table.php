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
        Schema::table('sponsors', function (Blueprint $table) {
            if (! Schema::hasColumn('sponsors', 'event_id')) {
                $table->foreignId('event_id')->nullable()->constrained('events')->cascadeOnDelete();
            }
            if (! Schema::hasColumn('sponsors', 'name')) {
                $table->string('name')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'logo_url')) {
                $table->string('logo_url')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'website')) {
                $table->string('website')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'contact_phone')) {
                $table->string('contact_phone')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'sponsorship_type')) {
                $table->string('sponsorship_type')->default('financial');
            }
            if (! Schema::hasColumn('sponsors', 'contribution_description')) {
                $table->text('contribution_description')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'contribution_value')) {
                $table->decimal('contribution_value', 12, 2)->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'notes')) {
                $table->text('notes')->nullable();
            }
            if (! Schema::hasColumn('sponsors', 'status')) {
                $table->string('status')->default('prospective');
            }
            if (! Schema::hasColumn('sponsors', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sponsors', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
            $table->dropColumn([
                'event_id', 'name', 'logo_url', 'website', 'contact_phone',
                'sponsorship_type', 'contribution_description', 'contribution_value',
                'notes', 'status', 'deleted_at',
            ]);
        });
    }
};
