<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function index(): Response
    {
        $participants = DB::table('participants')->select(['id', 'uuid', 'type', 'first_name', 'last_name', 'email', 'phone', 'organization_name', 'created_at'])->orderByDesc('created_at')->paginate(25);

        return Inertia::render('admin/participants/index', ['participants' => $participants]);
    }

    public function show(string $uuid): Response
    {
        $participant = DB::table('participants')->where('uuid', $uuid)->firstOrFail();
        $registrations = DB::table('event_registrations')->where('participant_id', $participant->id)->join('events', 'event_registrations.event_id', '=', 'events.id')->get(['event_registrations.*', 'events.title as event_title', 'events.starts_at']);

        return Inertia::render('admin/participants/show', ['participant' => $participant, 'registrations' => $registrations]);
    }
}
