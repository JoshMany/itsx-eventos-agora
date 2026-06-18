<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function index(): Response
    {
        $participants = Participant::query()
            ->select([
                'id', 'uuid', 'type', 'first_name', 'last_name',
                'email', 'phone', 'organization_name', 'created_at',
            ])
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString()
            ->through(fn ($p) => [
                'id' => $p->id,
                'uuid' => $p->uuid,
                'type' => $p->type,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'email' => $p->email,
                'phone' => $p->phone,
                'organization_name' => $p->organization_name,
                'created_at' => $p->created_at?->toISOString(),
            ]);

        return Inertia::render('admin/participants/index', [
            'participants' => $participants,
        ]);
    }

    public function show(string $uuid): Response
    {
        $participant = Participant::query()
            ->where('uuid', $uuid)
            ->firstOrFail();

        $registrations = $participant->eventRegistrations()
            ->with('event')
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'uuid' => $r->uuid,
                'status' => $r->status,
                'registered_at' => $r->created_at,
                'event_title' => $r->event?->title,
                'event_starts_at' => $r->event?->starts_at,
            ]);

        return Inertia::render('admin/participants/show', [
            'participant' => $participant,
            'registrations' => $registrations,
        ]);
    }
}
