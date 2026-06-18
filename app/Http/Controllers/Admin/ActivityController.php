<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(string $event): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $activities = DB::table('activities')
            ->where('activities.event_id', $eventData->id)
            ->leftJoin('tracks', 'activities.track_id', '=', 'tracks.id')
            ->leftJoin('activity_types', 'activities.activity_type_id', '=', 'activity_types.id')
            ->leftJoin('rooms', 'activities.room_id', '=', 'rooms.id')
            ->select([
                'activities.*',
                'tracks.name as track_name',
                'activity_types.name as type_name',
                'activity_types.code as type_code',
                'rooms.name as room_name',
            ])
            ->orderBy('activities.starts_at')
            ->get();

        return Inertia::render('admin/activities/index', [
            'event' => $eventData,
            'activities' => $activities,
        ]);
    }

    public function create(string $event): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();

        return Inertia::render('admin/activities/form', [
            'event' => $eventData,
            'tracks' => DB::table('tracks')->where('event_id', $eventData->id)->get(['id', 'name']),
            'activityTypes' => DB::table('activity_types')->get(['id', 'code', 'name', 'supports_teams', 'supports_speakers', 'supports_certificates']),
            'rooms' => DB::table('rooms')->get(['id', 'name', 'venue_id']),
        ]);
    }

    public function store(Request $request, string $event): RedirectResponse
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'activity_type_id' => 'required|exists:activity_types,id',
            'track_id' => 'nullable|exists:tracks,id',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'room_id' => 'nullable|exists:rooms,id',
        ]);

        DB::table('activities')->insert([
            'uuid' => (string) Str::orderedUuid(),
            'event_id' => $eventData->id,
            'track_id' => $data['track_id'] ?? null,
            'activity_type_id' => $data['activity_type_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'capacity' => $data['capacity'] ?? null,
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'] ?? null,
            'room_id' => $data['room_id'] ?? null,
            'venue_id' => $eventData->venue_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()
            ->route('admin.events.show', ['event' => $event, 'tab' => 'actividades'])
            ->with('success', 'Actividad creada.');
    }

    public function show(string $event, string $activity): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $activityData = DB::table('activities')
            ->where('activities.uuid', $activity)
            ->where('activities.event_id', $eventData->id)
            ->leftJoin('tracks', 'activities.track_id', '=', 'tracks.id')
            ->leftJoin('activity_types', 'activities.activity_type_id', '=', 'activity_types.id')
            ->leftJoin('rooms', 'activities.room_id', '=', 'rooms.id')
            ->select([
                'activities.*',
                'tracks.name as track_name',
                'activity_types.name as type_name',
                'activity_types.code as type_code',
                'rooms.name as room_name',
            ])
            ->firstOrFail();

        return Inertia::render('admin/activities/show', [
            'event' => $eventData,
            'activity' => $activityData,
        ]);
    }

    public function edit(string $event, string $activity): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $activityData = DB::table('activities')->where('uuid', $activity)->firstOrFail();

        return Inertia::render('admin/activities/form', [
            'event' => $eventData,
            'activity' => $activityData,
            'tracks' => DB::table('tracks')->where('event_id', $eventData->id)->get(['id', 'name']),
            'activityTypes' => DB::table('activity_types')->get(['id', 'code', 'name', 'supports_teams', 'supports_speakers', 'supports_certificates']),
            'rooms' => DB::table('rooms')->get(['id', 'name', 'venue_id']),
        ]);
    }

    public function update(Request $request, string $event, string $activity): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'activity_type_id' => 'required|exists:activity_types,id',
            'track_id' => 'nullable|exists:tracks,id',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'room_id' => 'nullable|exists:rooms,id',
        ]);

        DB::table('activities')->where('uuid', $activity)->update(array_merge($data, ['updated_at' => now()]));

        return redirect()
            ->route('admin.events.show', ['event' => $event, 'tab' => 'actividades'])
            ->with('success', 'Actividad actualizada.');
    }

    public function destroy(string $event, string $activity): RedirectResponse
    {
        DB::table('activities')->where('uuid', $activity)->delete();

        return back()->with('success', 'Actividad eliminada.');
    }
}
