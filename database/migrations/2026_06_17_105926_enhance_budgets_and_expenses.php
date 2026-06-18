<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_budgets', function (Blueprint $table) {
            $table->string('status')->default('draft')->after('approved_amount');
            $table->text('notes')->nullable()->after('status');
            $table->foreignId('approved_by')->nullable()->after('notes')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        Schema::table('event_expenses', function (Blueprint $table) {
            $table->text('description')->nullable()->after('concept');
            $table->integer('quantity')->default(1)->after('amount');
            $table->decimal('unit_price', 12, 2)->nullable()->after('quantity');
            $table->string('vendor_name')->nullable()->after('expense_date');
            $table->string('payment_method')->nullable()->after('vendor_name');
            $table->string('receipt_url')->nullable()->after('payment_method');
            $table->string('status')->default('pending')->after('receipt_url');
        });
    }

    public function down(): void
    {
        Schema::table('event_budgets', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['status', 'notes', 'approved_by', 'approved_at']);
        });

        Schema::table('event_expenses', function (Blueprint $table) {
            $table->dropColumn(['description', 'quantity', 'unit_price', 'vendor_name', 'payment_method', 'receipt_url', 'status']);
        });
    }
};
