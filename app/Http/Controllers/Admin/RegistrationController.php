<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function index(string $event): Response
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();

        $registrations = DB::table('event_registrations')
            ->where('event_id', $eventData->id)
            ->join('participants', 'event_registrations.participant_id', '=', 'participants.id')
            ->leftJoin('organizations', 'participants.organization_id', '=', 'organizations.id')
            ->select([
                'event_registrations.id',
                'event_registrations.uuid',
                'event_registrations.status',
                'event_registrations.registered_at',
                'event_registrations.created_at',
                'participants.id as participant_id',
                'participants.uuid as participant_uuid',
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

        $stats = DB::table('event_registrations')
            ->where('event_id', $eventData->id)
            ->selectRaw('count(*) as total')
            ->selectRaw("count(case when status = 'confirmed' then 1 end) as confirmed")
            ->selectRaw("count(case when status = 'pending' then 1 end) as pending")
            ->selectRaw("count(case when status = 'cancelled' then 1 end) as cancelled")
            ->selectRaw("count(case when status = 'attended' then 1 end) as attended")
            ->first();

        return Inertia::render('admin/registrations/index', [
            'event' => $eventData,
            'registrations' => $registrations,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request, string $event): RedirectResponse
    {
        $data = $request->validate([
            'participant_id' => 'nullable|integer|exists:participants,id',
            'first_name' => 'required_without:participant_id|string|max:255',
            'last_name' => 'required_without:participant_id|string|max:255',
            'email' => 'required_without:participant_id|email|max:255',
            'type' => 'required_without:participant_id|string|in:student,staff,external',
            'phone' => 'nullable|string|max:20',
            'organization_id' => 'nullable|integer|exists:organizations,id',
            'organization_name' => 'nullable|string|max:255',
            'student_number' => 'nullable|string|max:50',
        ]);

        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();

        // Find or create participant
        if (! empty($data['participant_id'])) {
            $pid = $data['participant_id'];
        } else {
            $existing = DB::table('participants')->where('email', $data['email'])->first();
            if ($existing) {
                $pid = $existing->id;
            } else {
                $pid = DB::table('participants')->insertGetId([
                    'uuid' => (string) Str::orderedUuid(),
                    'type' => $data['type'],
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'] ?? null,
                    'organization_id' => $data['organization_id'] ?? null,
                    'organization_name' => $data['organization_name'] ?? null,
                    'student_number' => $data['student_number'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Check duplicate
        $existingReg = DB::table('event_registrations')
            ->where('event_id', $eventData->id)
            ->where('participant_id', $pid)
            ->first();

        if ($existingReg) {
            return back()->with('warning', 'El participante ya está registrado en este evento.');
        }

        DB::table('event_registrations')->insert([
            'uuid' => (string) Str::orderedUuid(),
            'event_id' => $eventData->id,
            'participant_id' => $pid,
            'status' => 'confirmed',
            'registered_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Registro creado exitosamente.');
    }

    public function searchParticipants(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        $participants = DB::table('participants')
            ->leftJoin('organizations', 'participants.organization_id', '=', 'organizations.id')
            ->where(function ($q) use ($query) {
                $q->where('participants.first_name', 'ilike', "%{$query}%")
                    ->orWhere('participants.last_name', 'ilike', "%{$query}%")
                    ->orWhere('participants.email', 'ilike', "%{$query}%")
                    ->orWhere('participants.student_number', 'ilike', "%{$query}%");
            })
            ->select([
                'participants.id',
                'participants.uuid',
                'participants.first_name',
                'participants.last_name',
                'participants.email',
                'participants.type',
                'participants.student_number',
                'organizations.name as organization_name',
                'organizations.acronym as organization_acronym',
            ])
            ->limit(20)
            ->get();

        return response()->json($participants);
    }

    public function updateStatus(Request $request, string $event, string $registration): RedirectResponse
    {
        $data = $request->validate(['status' => 'required|string|in:pending,confirmed,cancelled,attended']);
        DB::table('event_registrations')->where('uuid', $registration)->update(['status' => $data['status'], 'updated_at' => now()]);

        return back()->with('success', 'Estado actualizado.');
    }

    public function filterCriterias(string $event): JsonResponse
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();

        $organizations = DB::table('organizations')->where('type', 'university')->orderBy('name')->get(['id', 'name', 'acronym']);
        $careers = DB::table('careers')->orderBy('name')->get(['id', 'name', 'code']);
        $generations = DB::table('participants')->whereNotNull('generation')->distinct()->orderBy('generation')->pluck('generation');
        $professors = DB::table('professors')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'department']);
        $subjects = DB::table('subjects')->orderBy('name')->get(['id', 'name', 'code']);

        return response()->json([
            'organizations' => $organizations,
            'careers' => $careers,
            'generations' => $generations,
            'professors' => $professors,
            'subjects' => $subjects,
        ]);
    }

    public function previewFilter(Request $request, string $event): JsonResponse
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $filters = $request->all();

        $query = DB::table('participants')
            ->leftJoin('organizations', 'participants.organization_id', '=', 'organizations.id')
            ->leftJoin('careers', 'participants.career_id', '=', 'careers.id')
            ->leftJoin('participant_subject', 'participants.id', '=', 'participant_subject.participant_id')
            ->leftJoin('subjects', 'participant_subject.subject_id', '=', 'subjects.id')
            ->leftJoin('participant_professor', 'participants.id', '=', 'participant_professor.participant_id')
            ->leftJoin('professors', 'participant_professor.professor_id', '=', 'professors.id')
            ->where('participants.type', 'student')
            ->select(['participants.id', 'participants.uuid', 'participants.first_name', 'participants.last_name', 'participants.email', 'participants.type', 'participants.student_number', 'participants.generation', 'organizations.name as organization_name', 'organizations.acronym as organization_acronym', 'careers.name as career_name'])
            ->distinct();

        if (! empty($filters['organization_id'])) {
            $query->where('participants.organization_id', $filters['organization_id']);
        }
        if (! empty($filters['career_id'])) {
            $query->where('participants.career_id', $filters['career_id']);
        }
        if (! empty($filters['generation'])) {
            $query->where('participants.generation', $filters['generation']);
        }
        if (! empty($filters['professor_id'])) {
            $query->where('participant_professor.professor_id', $filters['professor_id']);
        }
        if (! empty($filters['subject_id'])) {
            $query->where('participant_subject.subject_id', $filters['subject_id']);
        }

        $participants = $query->limit(200)->get();
        $total = $query->count();

        // Exclude already registered
        $registeredIds = DB::table('event_registrations')
            ->where('event_id', $eventData->id)
            ->pluck('participant_id')
            ->toArray();

        $participants = $participants->filter(fn ($p) => ! in_array($p->id, $registeredIds))->values();

        return response()->json([
            'total' => $total,
            'new' => $participants->count(),
            'already_registered' => count($registeredIds),
            'participants' => $participants,
        ]);
    }

    public function bulkStore(Request $request, string $event): RedirectResponse
    {
        $eventData = DB::table('events')->where('uuid', $event)->firstOrFail();
        $filters = $request->all();

        $query = DB::table('participants')
            ->leftJoin('participant_subject', 'participants.id', '=', 'participant_subject.participant_id')
            ->leftJoin('participant_professor', 'participants.id', '=', 'participant_professor.participant_id')
            ->where('participants.type', 'student')
            ->select('participants.id')
            ->distinct();

        if (! empty($filters['organization_id'])) {
            $query->where('participants.organization_id', $filters['organization_id']);
        }
        if (! empty($filters['career_id'])) {
            $query->where('participants.career_id', $filters['career_id']);
        }
        if (! empty($filters['generation'])) {
            $query->where('participants.generation', $filters['generation']);
        }
        if (! empty($filters['professor_id'])) {
            $query->where('participant_professor.professor_id', $filters['professor_id']);
        }
        if (! empty($filters['subject_id'])) {
            $query->where('participant_subject.subject_id', $filters['subject_id']);
        }

        $participantIds = $query->pluck('participants.id')->toArray();

        $registeredIds = DB::table('event_registrations')
            ->where('event_id', $eventData->id)
            ->pluck('participant_id')
            ->toArray();

        $toRegister = array_diff($participantIds, $registeredIds);

        if (empty($toRegister)) {
            return back()->with('info', 'Todos los participantes filtrados ya estaban registrados.');
        }

        $now = now();
        $inserts = [];
        foreach ($toRegister as $pid) {
            $inserts[] = [
                'uuid' => (string) Str::orderedUuid(),
                'event_id' => $eventData->id,
                'participant_id' => $pid,
                'status' => 'confirmed',
                'registered_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('event_registrations')->insert($inserts);

        return back()->with('success', count($inserts).' asistentes registrados masivamente.');
    }

    public function destroy(string $event, string $registration): RedirectResponse
    {
        DB::table('event_registrations')->where('uuid', $registration)->delete();

        return back()->with('success', 'Registro eliminado.');
    }
}
