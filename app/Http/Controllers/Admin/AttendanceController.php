<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(string $event): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $registrations = DB::table('event_registrations')->where('event_id', $eventData->id)->join('participants', 'event_registrations.participant_id', '=', 'participants.id')->leftJoin('event_attendances', function ($j) {
            $j->on('event_registrations.event_id', '=', 'event_attendances.event_id')->on('event_registrations.participant_id', '=', 'event_attendances.participant_id');
        })->select(['event_registrations.id', 'participants.first_name', 'participants.last_name', 'participants.email', 'participants.type', 'event_attendances.checked_in_at'])->get();
        $stats = ['total' => $registrations->count(), 'checkedIn' => $registrations->whereNotNull('checked_in_at')->count()];

        return Inertia::render('admin/attendance/index', ['event' => $eventData, 'registrations' => $registrations, 'stats' => $stats]);
    }

    public function store(Request $request, string $event): RedirectResponse
    {
        $data = $request->validate(['registration_id' => 'required|integer']);
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $reg = DB::table('event_registrations')->where('id', $data['registration_id'])->firstOrFail();
        DB::table('event_attendances')->insertOrIgnore(['uuid' => (string) Str::orderedUuid(), 'event_id' => $eventData->id, 'participant_id' => $reg->participant_id, 'checked_in_at' => now()]);
        DB::table('event_registrations')->where('id', $reg->id)->update(['status' => 'attended', 'updated_at' => now()]);

        return back()->with('success','Asistencia registrada.');
    }
}
