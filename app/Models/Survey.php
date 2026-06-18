<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Survey extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid', 'event_id', 'activity_id', 'title', 'is_required', 'is_template',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'is_template' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Survey $survey): void {
            if (! $survey->uuid) {
                $survey->uuid = (string) Str::orderedUuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /** @return BelongsTo<Event, $this> */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /** @return HasMany<SurveyQuestion, $this> */
    public function questions(): HasMany
    {
        return $this->hasMany(SurveyQuestion::class)->orderBy('sort_order');
    }

    /** @return HasMany<SurveyResponse, $this> */
    public function responses(): HasMany
    {
        return $this->hasMany(SurveyResponse::class);
    }
}
