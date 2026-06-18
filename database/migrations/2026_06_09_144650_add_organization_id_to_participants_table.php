<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->renameColumn('institution', 'organization_name');
            $table->foreignId('organization_id')->nullable()->after('phone')->constrained('organizations')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
            $table->renameColumn('organization_name', 'institution');
        });
    }
};
