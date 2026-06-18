<?php

namespace App\Http\Controllers\Participants;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantDashboardController extends Controller
{
    public function index(): Response
    {
        /** @var Participant $participant */
        $participant = Auth::guard('participant')->user();

        $registrations = $participant->eventRegistrations()
            ->with('event')
            ->latest()
            ->get();

        return Inertia::render('participant/dashboard', [
            'participant' => $participant,
            'registrations' => $registrations,
        ]);
    }
}
