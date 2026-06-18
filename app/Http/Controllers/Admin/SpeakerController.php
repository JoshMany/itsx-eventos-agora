<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SpeakerController extends Controller
{
    public function index(string $event): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();

        $speakers = DB::table('speakers')
            ->join('activity_speaker', 'speakers.id', '=', 'activity_speaker.speaker_id')
            ->join('activities', 'activity_speaker.activity_id', '=', 'activities.id')
            ->where('activities.event_id', $eventData->id)
            ->select([
                'speakers.id',
                'speakers.uuid',
                'speakers.first_name',
                'speakers.last_name',
                'speakers.email',
                'speakers.organization',
                'speakers.position',
                'speakers.bio',
                'speakers.photo_url',
                DB::raw("string_agg(DISTINCT activities.title, ', ') as activity_titles"),
            ])
            ->groupBy('speakers.id', 'speakers.uuid', 'speakers.first_name', 'speakers.last_name', 'speakers.email', 'speakers.organization', 'speakers.position', 'speakers.bio', 'speakers.photo_url')
            ->orderBy('speakers.last_name')
            ->paginate(25);

        // Attach activity_ids per speaker
        $speakerIds = collect($speakers->items())->pluck('id');
        $activityMap = DB::table('activity_speaker')
            ->whereIn('speaker_id', $speakerIds)
            ->get()
            ->groupBy('speaker_id')
            ->map(fn ($items) => $items->pluck('activity_id')->toArray());

        $speakers->getCollection()->transform(function ($speaker) use ($activityMap) {
            $speaker->activity_ids = $activityMap->get($speaker->id, []);

            return $speaker;
        });

        return Inertia::render('admin/speakers/index', [
            'event' => $eventData,
            'speakers' => $speakers,
        ]);
    }

    public function store(Request $request, string $event): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'photo_url' => 'nullable|string|max:255',
            'social_links' => 'nullable|string|max:255',
            'activity_ids' => 'nullable|array',
            'activity_ids.*' => 'integer|exists:activities,id',
        ]);

        $speakerId = DB::table('speakers')->insertGetId([
            'uuid' => (string) Str::orderedUuid(),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'organization' => $data['organization'] ?? null,
            'position' => $data['position'] ?? null,
            'bio' => $data['bio'] ?? null,
            'photo_url' => $data['photo_url'] ?? null,
            'social_links' => $data['social_links'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (! empty($data['activity_ids'])) {
            $pivot = array_map(fn ($aid) => ['activity_id' => $aid, 'speaker_id' => $speakerId], $data['activity_ids']);
            DB::table('activity_speaker')->insert($pivot);
        }

        return back()->with('success', 'Ponente registrado.');
    }

    public function update(Request $request, string $event, string $speaker): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'photo_url' => 'nullable|string|max:255',
            'social_links' => 'nullable|string|max:255',
            'activity_ids' => 'nullable|array',
            'activity_ids.*' => 'integer|exists:activities,id',
        ]);

        DB::table('speakers')->where('uuid', $speaker)->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'organization' => $data['organization'] ?? null,
            'position' => $data['position'] ?? null,
            'bio' => $data['bio'] ?? null,
            'photo_url' => $data['photo_url'] ?? null,
            'social_links' => $data['social_links'] ?? null,
            'updated_at' => now(),
        ]);

        $speakerData = DB::table('speakers')->where('uuid', $speaker)->firstOrFail();
        DB::table('activity_speaker')->where('speaker_id', $speakerData->id)->delete();

        if (! empty($data['activity_ids'])) {
            $pivot = array_map(fn ($aid) => ['activity_id' => $aid, 'speaker_id' => $speakerData->id], $data['activity_ids']);
            DB::table('activity_speaker')->insert($pivot);
        }

        return back()->with('success', 'Ponente actualizado.');
    }

    public function destroy(string $event, string $speaker): RedirectResponse
    {
        DB::table('speakers')->where('uuid', $speaker)->delete();

        return back()->with('success', 'Ponente eliminado.');
    }
}
