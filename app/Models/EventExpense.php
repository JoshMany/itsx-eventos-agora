<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventExpense extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'event_id', 'budget_category_id', 'concept', 'description', 'amount', 'quantity', 'unit_price',
        'expense_date', 'vendor_name', 'payment_method', 'receipt_url', 'status', 'over_budget_note',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'expense_date' => 'datetime',
        ];
    }

    /** @return BelongsTo<Event, $this> */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /** @return BelongsTo<EventBudget, $this> */
    public function budget(): BelongsTo
    {
        return $this->belongsTo(EventBudget::class, 'event_id', 'event_id');
    }
}
