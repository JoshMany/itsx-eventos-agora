<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventExpense;
use App\Models\Sponsor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $archived = request('archived') === '1';
        $query = DB::table('events')
            ->select(['id', 'uuid', 'title', 'slug', 'status', 'starts_at', 'capacity', 'archived_at'])
            ->orderByDesc('starts_at');

        if ($archived) {
            $query->whereNotNull('archived_at');
        } else {
            $query->whereNull('archived_at')->whereNull('deleted_at');
        }

        $events = $query->paginate(25)->withQueryString();

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'archived' => $archived,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/events/form', [
            'venues' => DB::table('venues')->get(['id', 'name']),
            'rooms' => DB::table('rooms')->get(['id', 'name', 'venue_id']),
            'categories' => DB::table('event_categories')->get(['id', 'name', 'slug']),
            'tags' => DB::table('tags')->get(['id', 'name', 'slug']),
            'tracks' => [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255', 'slug' => 'nullable|string|max:255|unique:events,slug',
            'short_description' => 'nullable|string|max:500', 'description' => 'nullable|string',
            'status' => 'required|string', 'capacity' => 'nullable|integer',
            'starts_at' => 'required|date', 'ends_at' => 'nullable|date|after:starts_at',
            'registration_starts_at' => 'nullable|date', 'registration_ends_at' => 'nullable|date',
            'venue_id' => 'nullable|exists:venues,id', 'room_id' => 'nullable|exists:rooms,id',
            'tracks' => 'nullable|array',
            'tracks.*.name' => 'required|string|max:255',
            'tracks.*.description' => 'nullable|string|max:1000',
        ]);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['uuid'] = (string) Str::orderedUuid();

        $tracks = $data['tracks'] ?? [];
        unset($data['tracks']);

        DB::table('events')->insert(array_merge($data, ['created_at' => now(), 'updated_at' => now()]));

        $eventId = DB::getPdo()->lastInsertId();
        $this->syncTracks($eventId, $tracks);

        return redirect()->route('admin.events.index')->with('success', 'Evento creado.');
    }

    public function show(string $uuid): Response
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();
        $tab = request('tab', 'info');

        $props = [
            'event' => $event,
            'tab' => $tab,
            'tracks' => DB::table('tracks')->where('event_id', $event->id)->orderBy('sort_order')->get(['id', 'name', 'description']),
        ];

        if ($tab === 'actividades') {
            $props['activities'] = DB::table('activities')
                ->where('activities.event_id', $event->id)
                ->leftJoin('tracks', 'activities.track_id', '=', 'tracks.id')
                ->leftJoin('activity_types', 'activities.activity_type_id', '=', 'activity_types.id')
                ->leftJoin('rooms', 'activities.room_id', '=', 'rooms.id')
                ->select(['activities.*', 'tracks.name as track_name', 'activity_types.name as type_name', 'activity_types.code as type_code', 'rooms.name as room_name'])
                ->orderBy('activities.starts_at')
                ->get();
            $props['activityTypes'] = DB::table('activity_types')->get(['id', 'code', 'name', 'supports_teams', 'supports_speakers', 'supports_certificates']);
            $props['rooms'] = DB::table('rooms')->get(['id', 'name', 'venue_id']);
        }

        if ($tab === 'asistentes') {
            $props['registrations'] = DB::table('event_registrations')
                ->where('event_id', $event->id)
                ->join('participants', 'event_registrations.participant_id', '=', 'participants.id')
                ->leftJoin('organizations', 'participants.organization_id', '=', 'organizations.id')
                ->select([
                    'event_registrations.id',
                    'event_registrations.uuid',
                    'event_registrations.status',
                    'event_registrations.registered_at',
                    'event_registrations.created_at',
                    'participants.first_name',
                    'participants.last_name',
                    'participants.email',
                    'participants.type',
                    'participants.phone',
                    'participants.student_number',
                    'organizations.name as organization_name',
                    'organizations.acronym as organization_acronym',
                ])
                ->orderByDesc('event_registrations.created_at')
                ->paginate(25);
        }

        if ($tab === 'ponentes') {
            $speakers = DB::table('speakers')
                ->join('activity_speaker', 'speakers.id', '=', 'activity_speaker.speaker_id')
                ->join('activities', 'activity_speaker.activity_id', '=', 'activities.id')
                ->where('activities.event_id', $event->id)
                ->select([
                    'speakers.id',
                    'speakers.uuid',
                    'speakers.first_name',
                    'speakers.last_name',
                    'speakers.email',
                    'speakers.phone',
                    'speakers.organization',
                    'speakers.position',
                    'speakers.bio',
                    'speakers.photo_url',
                    'speakers.social_links',
                    DB::raw("string_agg(DISTINCT activities.title, ', ') as activity_titles"),
                ])
                ->groupBy('speakers.id', 'speakers.uuid', 'speakers.first_name', 'speakers.last_name', 'speakers.email', 'speakers.phone', 'speakers.organization', 'speakers.position', 'speakers.bio', 'speakers.photo_url', 'speakers.social_links')
                ->orderBy('speakers.last_name')
                ->get();

            $speakerIds = $speakers->pluck('id');
            $activityMap = DB::table('activity_speaker')
                ->whereIn('speaker_id', $speakerIds)
                ->get()
                ->groupBy('speaker_id')
                ->map(fn ($items) => $items->pluck('activity_id')->toArray());

            $props['speakers'] = $speakers->map(function ($speaker) use ($activityMap) {
                $speaker->activity_ids = $activityMap->get($speaker->id, []);

                return $speaker;
            });

            $props['eventActivities'] = DB::table('activities')
                ->where('event_id', $event->id)
                ->get(['id', 'title']);
        }

        if ($tab === 'certificados') {
            $props['certificates'] = DB::table('certificates')
                ->where('certificates.event_id', $event->id)
                ->join('participants', 'certificates.participant_id', '=', 'participants.id')
                ->leftJoin('certificate_types', 'certificates.certificate_type_id', '=', 'certificate_types.id')
                ->leftJoin('activities', 'certificates.activity_id', '=', 'activities.id')
                ->select([
                    'certificates.uuid',
                    'certificates.folio',
                    'certificates.verification_code',
                    'certificates.pdf_path',
                    'certificates.generated_at',
                    'certificates.created_at',
                    'certificates.activity_id',
                    'participants.first_name',
                    'participants.last_name',
                    'participants.email',
                    'certificate_types.name as certificate_type_name',
                    'activities.title as activity_title',
                ])
                ->orderByDesc('certificates.created_at')
                ->paginate(25);

            $props['eventParticipants'] = DB::table('event_registrations')
                ->where('event_id', $event->id)
                ->join('participants', 'event_registrations.participant_id', '=', 'participants.id')
                ->select([
                    'participants.id',
                    'participants.first_name',
                    'participants.last_name',
                    'participants.email',
                ])
                ->orderBy('participants.last_name')
                ->get();

            $props['eventActivities'] = DB::table('activities')
                ->where('event_id', $event->id)
                ->join('activity_types', 'activities.activity_type_id', '=', 'activity_types.id')
                ->select(['activities.id', 'activities.title', 'activity_types.code as activity_type_code', 'activity_types.name as activity_type_name'])
                ->orderBy('activities.starts_at')
                ->get();

            // Compute available certificate types based on event activities
            $activityTypeCodes = $props['eventActivities']->pluck('activity_type_code')->unique()->toArray();
            $map = config('certificates.map');
            $allowedCodes = $map['*'] ?? [];

            foreach ($activityTypeCodes as $code) {
                $specific = $map[$code] ?? [];
                $allowedCodes = array_unique([...$allowedCodes, ...$specific]);
            }

            // If no activities, all types are available
            $allTypes = DB::table('certificate_types')->get(['id', 'code', 'name']);
            $props['certificateTypes'] = empty($activityTypeCodes)
                ? $allTypes
                : $allTypes->whereIn('code', $allowedCodes)->values();

            // Existing certificates per participant for duplicate check
            $props['existingCertificates'] = DB::table('certificates')
                ->where('event_id', $event->id)
                ->join('certificate_types', 'certificates.certificate_type_id', '=', 'certificate_types.id')
                ->select(['certificates.participant_id', 'certificates.activity_id', 'certificates.certificate_type_id', 'certificate_types.name as type_name'])
                ->get()
                ->groupBy('participant_id')
                ->map(fn ($items) => $items->map(fn ($item) => [
                    'activity_id' => $item->activity_id,
                    'certificate_type_id' => $item->certificate_type_id,
                    'type_name' => $item->type_name,
                ])->values());
        }

        if ($tab === 'encuestas') {
            $props['surveys'] = DB::table('surveys')
                ->where('surveys.event_id', $event->id)
                ->leftJoin('activities', 'surveys.activity_id', '=', 'activities.id')
                ->select([
                    'surveys.uuid',
                    'surveys.title',
                    'surveys.is_required',
                    'surveys.created_at',
                    'activities.title as activity_title',
                ])
                ->orderByDesc('surveys.created_at')
                ->get();
        }

        if ($tab === 'presupuestos') {
            $props['budget'] = DB::table('event_budgets')
                ->where('event_id', $event->id)
                ->first();

            if ($props['budget']) {
                $props['expenses'] = EventExpense::query()
                    ->where('event_id', $event->id)
                    ->withTrashed()
                    ->leftJoin('budget_categories', 'event_expenses.budget_category_id', '=', 'budget_categories.id')
                    ->select([
                        'event_expenses.*',
                        'budget_categories.name as category_name',
                        'budget_categories.code as category_code',
                    ])
                    ->orderByDesc('event_expenses.expense_date')
                    ->get();

                $props['categories'] = DB::table('budget_categories')->get(['id', 'name', 'code']);

                $props['sponsors'] = Sponsor::query()
                    ->where('event_id', $event->id)
                    ->where('sponsorship_type', 'financial')
                    ->get(['id', 'name', 'contribution_value']);
            }
        }

        if ($tab === 'patrocinadores') {
            $props['sponsors'] = Sponsor::query()
                ->where('event_id', $event->id)
                ->withTrashed()
                ->orderByDesc('created_at')
                ->get();
        }

        return Inertia::render('admin/events/show', $props);
    }

    public function edit(string $uuid): Response
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();

        return Inertia::render('admin/events/form', [
            'event' => $event,
            'venues' => DB::table('venues')->get(['id', 'name']),
            'rooms' => DB::table('rooms')->get(['id', 'name', 'venue_id']),
            'categories' => DB::table('event_categories')->get(['id', 'name', 'slug']),
            'tags' => DB::table('tags')->get(['id', 'name', 'slug']),
            'tracks' => DB::table('tracks')->where('event_id', $event->id)->orderBy('sort_order')->get(['id', 'name', 'description']),
        ]);
    }

    public function update(Request $request, string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'capacity' => 'nullable|integer',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date',
            'registration_starts_at' => 'nullable|date',
            'registration_ends_at' => 'nullable|date',
            'venue_id' => 'nullable|exists:venues,id',
            'room_id' => 'nullable|exists:rooms,id',
            'tracks' => 'nullable|array',
            'tracks.*.name' => 'required|string|max:255',
            'tracks.*.description' => 'nullable|string|max:1000',
        ]);

        $tracks = $data['tracks'] ?? [];
        unset($data['tracks']);

        DB::table('events')->where('uuid', $uuid)->update(array_merge($data, ['updated_at' => now()]));
        $this->syncTracks($event->id, $tracks);

        return back()->with('success', 'Evento actualizado.');
    }

    private function syncTracks(int $eventId, array $tracks): void
    {
        $existingIds = DB::table('tracks')
            ->where('event_id', $eventId)
            ->pluck('id')
            ->toArray();

        $submittedIds = [];
        $order = 0;

        foreach ($tracks as $track) {
            $values = [
                'name' => $track['name'],
                'description' => $track['description'] ?? null,
                'sort_order' => $order++,
                'updated_at' => now(),
            ];

            if (! empty($track['id']) && in_array((int) $track['id'], $existingIds)) {
                DB::table('tracks')->where('id', $track['id'])->update($values);
                $submittedIds[] = (int) $track['id'];
            } else {
                $newId = DB::table('tracks')->insertGetId(array_merge($values, [
                    'uuid' => (string) Str::orderedUuid(),
                    'event_id' => $eventId,
                    'created_at' => now(),
                ]));
                $submittedIds[] = $newId;
            }
        }

        $toDelete = array_diff($existingIds, $submittedIds);
        if (! empty($toDelete)) {
            DB::table('tracks')->whereIn('id', $toDelete)->delete();
        }
    }

    public function destroy(string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();

        // Soft delete: set deleted_at
        DB::table('events')->where('uuid', $uuid)->update([
            'deleted_at' => now(),
            'updated_at' => now(),
        ]);

        activity()
            ->event('deleted')
            ->withProperties(['uuid' => $uuid, 'title' => $event->title])
            ->log("Evento archivado (papelera): {$event->title}");

        return redirect()->route('admin.events.index')->with('success', 'Evento enviado a la papelera.');
    }

    public function restore(string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->whereNotNull('deleted_at')->firstOrFail();

        DB::table('events')->where('uuid', $uuid)->update([
            'deleted_at' => null,
            'updated_at' => now(),
        ]);

        activity()
            ->event('restored')
            ->withProperties(['uuid' => $uuid, 'title' => $event->title])
            ->log("Evento restaurado de papelera: {$event->title}");

        return back()->with('success', 'Evento restaurado.');
    }

    public function archive(string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();

        DB::table('events')->where('uuid', $uuid)->update([
            'archived_at' => now(),
            'archived_by' => auth()->id(),
            'updated_at' => now(),
        ]);

        activity()
            ->event('updated')
            ->withProperties(['uuid' => $uuid, 'title' => $event->title, 'action' => 'archive'])
            ->log("Evento archivado: {$event->title}");

        return redirect()->route('admin.events.index')->with('success', 'Evento archivado.');
    }

    public function unarchive(string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->whereNotNull('archived_at')->firstOrFail();

        DB::table('events')->where('uuid', $uuid)->update([
            'archived_at' => null,
            'archived_by' => null,
            'updated_at' => now(),
        ]);

        activity()
            ->event('updated')
            ->withProperties(['uuid' => $uuid, 'title' => $event->title, 'action' => 'unarchive'])
            ->log("Evento desarchivado: {$event->title}");

        return redirect()->route('admin.events.index', ['archived' => '1'])->with('success', 'Evento desarchivado.');
    }

    public function forceDelete(string $uuid): RedirectResponse
    {
        $event = DB::table('events')->where('uuid', $uuid)->firstOrFail();

        // Solo permitir eliminación permanente de eventos que NUNCA fueron públicos
        $publicStatuses = ['published', 'approved', 'finished'];
        if (in_array($event->status, $publicStatuses)) {
            return back()->with('error', 'No se puede eliminar permanentemente un evento que fue publicado o aprobado. Usa la opción de archivar en su lugar.');
        }

        $eventTitle = $event->title;

        DB::transaction(function () use ($event) {
            $eventId = $event->id;

            // Eliminar registros relacionados en orden (respetando FKs)
            DB::table('event_expenses')->where('event_id', $eventId)->delete();
            DB::table('event_sponsors')->where('event_id', $eventId)->delete();
            DB::table('event_budgets')->where('event_id', $eventId)->delete();
            DB::table('certificates')->where('event_id', $eventId)->delete();
            DB::table('surveys')->where('event_id', $eventId)->delete();
            DB::table('event_attendances')->where('event_id', $eventId)->delete();
            DB::table('event_participant_roles')->where('event_id', $eventId)->delete();
            DB::table('event_category_event')->where('event_id', $eventId)->delete();
            DB::table('event_registrations')->where('event_id', $eventId)->delete();

            // Actividades y sus relaciones
            $activityIds = DB::table('activities')->where('event_id', $eventId)->pluck('id')->toArray();
            if (! empty($activityIds)) {
                DB::table('activity_speaker')->whereIn('activity_id', $activityIds)->delete();
                DB::table('activities')->where('event_id', $eventId)->delete();
            }

            // Tracks
            DB::table('tracks')->where('event_id', $eventId)->delete();

            // Sponsors (tabla sponsors que tiene event_id)
            DB::table('sponsors')->where('event_id', $eventId)->delete();

            // Finalmente el evento
            DB::table('events')->where('id', $eventId)->delete();
        });

        activity()
            ->event('deleted')
            ->withProperties(['uuid' => $uuid, 'title' => $eventTitle])
            ->log("Evento eliminado permanentemente: {$eventTitle}");

        return redirect()->route('admin.events.index')->with('success', 'Evento eliminado permanentemente.');
    }

    public function updateStatus(Request $request, string $uuid): RedirectResponse
    {
        $request->validate(['status' => 'required|string']);
        DB::table('events')->where('uuid', $uuid)->update(['status' => $request->status, 'published_at' => $request->status === 'published' ? now() : null, 'updated_at' => now()]);

        return back()->with('success', 'Estado actualizado.');
    }
}
