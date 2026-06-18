<?php

namespace App\Http\Controllers\Participants;

use App\Actions\Events\RegisterParticipantForEventAction;
use App\Actions\Participants\RegisterParticipantAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Participants\RegisterParticipantRequest;
use Illuminate\Http\RedirectResponse;

class ParticipantRegistrationController extends Controller
{
    public function store(
        RegisterParticipantRequest $request,
        RegisterParticipantAction $registerParticipant,
        RegisterParticipantForEventAction $registerForEvent,
    ): RedirectResponse {
        $data = $request->validated();
        $eventId = (int) $data['event_id'];

        $participant = $registerParticipant->execute($data);
        $registration = $registerForEvent->execute($eventId, $participant);

        return redirect()->route('registration.confirmation', ['uuid' => $registration->uuid])
            ->with('success', '|Te has registrado exitosamente!');
    }
}
