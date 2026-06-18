<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable([
    'first_name',
    'last_name',
    'email',
    'phone',
    'organization',
    'position',
    'bio',
    'photo_url',
    'social_links',
])]
class Speaker extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (Speaker $speaker): void {
            if (! $speaker->uuid) {
                $speaker->uuid = (string) Str::orderedUuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function fullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'activity_speaker');
    }
}
