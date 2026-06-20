<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class EventBudget extends Model
{
    use LogsActivity;

    protected $fillable = [
        'event_id', 'planned_amount', 'approved_amount', 'status', 'notes', 'approved_by', 'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'planned_amount' => 'decimal:2',
            'approved_amount' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Event, $this> */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /** @return HasMany<EventExpense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(EventExpense::class, 'event_id', 'event_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->setDescriptionForEvent(fn (string $eventName) => "Presupuesto {$eventName}: evento #{$this->event_id}");
    }
}
