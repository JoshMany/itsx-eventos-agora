<?php

namespace Database\Factories;

use App\Enums\RegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EventRegistration>
 */
class EventRegistrationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'participant_id' => Participant::factory(),
            'status' => fake()->randomElement(array_map(fn ($c) => $c->value, RegistrationStatus::cases())),
            'registered_at' => now(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(['status' => RegistrationStatus::Confirmed->value]);
    }

    public function attended(): static
    {
        return $this->state(['status' => RegistrationStatus::Attended->value]);
    }
}
