<?php

namespace App\Actions\Events;

use App\Enums\RegistrationStatus;
use App\Jobs\SendRegistrationConfirmationJob;
use App\Models\EventRegistration;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;

class RegisterParticipantForEventAction
{
    public function execute(int $eventId, Participant $participant): EventRegistration
    {
        $registration = DB::transaction(function () use ($eventId, $participant): EventRegistration {
            /** @var EventRegistration $registration */
            $registration = EventRegistration::firstOrCreate(
                [
                    'event_id' => $eventId,
                    'participant_id' => $participant->id,
                ],
                [
                    'status' => RegistrationStatus::Confirmed,
                    'registered_at' => now(),
                ],
            );

            return $registration;
        });

        SendRegistrationConfirmationJob::dispatch($registration)->afterCommit();

        return $registration;
    }
}
