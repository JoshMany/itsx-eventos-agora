<?php

namespace App\Models;

use App\Enums\ParticipantType;
use Database\Factories\ParticipantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

#[Fillable([
    'type',
    'first_name',
    'last_name',
    'email',
    'phone',
    'organization_id',
    'organization_name',
    'student_number',
])]
class Participant extends Authenticatable
{
    /** @use HasFactory<ParticipantFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ParticipantType::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Participant $participant): void {
            if (! $participant->uuid) {
                $participant->uuid = (string) Str::orderedUuid();
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

    /** @return HasMany<EventRegistration, $this> */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
