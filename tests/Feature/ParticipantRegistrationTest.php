<?php

use App\Enums\ParticipantType;
use App\Enums\RegistrationStatus;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('participant can be registered', function () {
    $participant = Participant::factory()->external()->create();

    expect($participant)->toBeInstanceOf(Participant::class)
        ->and($participant->uuid)->not->toBeNull()
        ->and($participant->type)->toBe(ParticipantType::External)
        ->and($participant->email)->not->toBeNull();
});

test('registering with same email returns existing participant', function () {
    $original = Participant::factory()->student()->create();

    $duplicate = Participant::firstOrCreate(
        ['email' => $original->email],
        [
            'type' => ParticipantType::External->value,
            'first_name' => 'Other',
            'last_name' => 'Name',
        ],
    );

    expect($duplicate->id)->toBe($original->id)
        ->and($duplicate->type)->toBe(ParticipantType::Student);
});

test('participant can register for an event', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->external()->create();

    $registration = $event->registrations()->create([
        'participant_id' => $participant->id,
        'status' => RegistrationStatus::Confirmed,
        'registered_at' => now(),
    ]);

    expect($registration->status)->toBe(RegistrationStatus::Confirmed)
        ->and($registration->participant->is($participant))->toBeTrue()
        ->and($registration->uuid)->not->toBeNull();
});

test('participant can have multiple event registrations', function () {
    $participant = Participant::factory()->student()->create();
    $events = Event::factory()->count(3)->create();

    foreach ($events as $event) {
        $event->registrations()->create([
            'participant_id' => $participant->id,
            'status' => RegistrationStatus::Confirmed,
            'registered_at' => now(),
        ]);
    }

    expect($participant->eventRegistrations)->toHaveCount(3);
});

test('duplicate event registration is prevented', function () {
    $event = Event::factory()->create();
    $participant = Participant::factory()->external()->create();

    $event->registrations()->create([
        'participant_id' => $participant->id,
        'status' => RegistrationStatus::Confirmed,
        'registered_at' => now(),
    ]);

    $this->expectException(UniqueConstraintViolationException::class);

    $event->registrations()->create([
        'participant_id' => $participant->id,
        'status' => RegistrationStatus::Confirmed,
        'registered_at' => now(),
    ]);
})->throws(UniqueConstraintViolationException::class);

test('soft deletes work on participant', function () {
    $participant = Participant::factory()->create();
    $participant->delete();

    expect(Participant::find($participant->id))->toBeNull()
        ->and(Participant::withTrashed()->find($participant->id))->not->toBeNull();
});
