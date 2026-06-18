<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Sponsor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'event_id', 'name', 'logo_url', 'website',
        'contact_name', 'contact_email', 'contact_phone',
        'sponsorship_type', 'contribution_description', 'contribution_value',
        'notes', 'status',
    ];

    protected function casts(): array
    {
        return [
            'contribution_value' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Sponsor $sponsor) {
            $sponsor->uuid = (string) Str::uuid();
        });
    }

    /** @return BelongsTo<Event, $this> */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
