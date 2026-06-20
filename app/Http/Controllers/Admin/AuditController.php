<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class AuditController extends Controller
{
    /**
     * Display a filtered, paginated audit trail.
     */
    public function index(Request $request): Response
    {
        $query = Activity::with('causer:id,name,email')
            ->latest();

        // Filtro: Usuario (causer)
        if ($request->filled('causer_id')) {
            $query->where('causer_id', $request->input('causer_id'));
        }

        // Filtro: Tipo de entidad (modelo)
        if ($request->filled('subject_type')) {
            $subjectType = $request->input('subject_type');

            // Catálogos: actividades sin modelo Eloquent (subject_type = null)
            if ($subjectType === 'catalog') {
                $query->whereNull('subject_type')
                    ->where('description', 'ilike', 'Catálogo:%');
            } else {
                $query->where('subject_type', $subjectType);
            }
        }

        // Filtro: Acción (created, updated, deleted, restored)
        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        // Filtro: Rango de fechas
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Filtro: Búsqueda libre (descripción o propiedades JSON)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'ilike', "%{$search}%")
                    ->orWhere('properties', 'ilike', "%{$search}%");
            });
        }

        // Filtro: Evento específico (busca en properties o subject)
        if ($request->filled('event_filter')) {
            $eventId = $request->input('event_filter');
            // Buscar actividades donde subject sea el evento, o properties contengan event_id
            $query->where(function ($q) use ($eventId) {
                $q->where(function ($sq) use ($eventId) {
                    $sq->where('subject_type', Event::class)
                        ->where('subject_id', $eventId);
                })->orWhere('properties->event_id', $eventId)
                    ->orWhere('properties->attributes->event_id', $eventId)
                    ->orWhere('properties->old->event_id', $eventId);
            });
        }

        $activities = $query->paginate(30)->withQueryString();

        // Opciones para los filtros
        $users = User::select('id', 'name', 'email')->orderBy('name')->get();

        $modelTypes = [
            ['value' => 'App\\Models\\Event', 'label' => 'Eventos'],
            ['value' => 'App\\Models\\Participant', 'label' => 'Participantes'],
            ['value' => 'App\\Models\\User', 'label' => 'Usuarios'],
            ['value' => 'App\\Models\\EventRegistration', 'label' => 'Registros'],
            ['value' => 'App\\Models\\Speaker', 'label' => 'Ponentes'],
            ['value' => 'App\\Models\\Sponsor', 'label' => 'Patrocinadores'],
            ['value' => 'App\\Models\\Certificate', 'label' => 'Constancias'],
            ['value' => 'App\\Models\\EventBudget', 'label' => 'Presupuestos'],
            ['value' => 'App\\Models\\EventExpense', 'label' => 'Gastos'],
            ['value' => 'catalog', 'label' => 'Catálogos'],
        ];

        $events = [
            ['value' => 'created', 'label' => 'Creado'],
            ['value' => 'updated', 'label' => 'Actualizado'],
            ['value' => 'deleted', 'label' => 'Eliminado'],
            ['value' => 'restored', 'label' => 'Restaurado'],
        ];

        $eventList = Event::select('id', 'title')->orderBy('title')->get();

        // Mapear nombres de modelo para display
        $modelLabelMap = [
            'App\\Models\\Event' => 'Evento',
            'App\\Models\\Participant' => 'Participante',
            'App\\Models\\User' => 'Usuario',
            'App\\Models\\EventRegistration' => 'Registro',
            'App\\Models\\Speaker' => 'Ponente',
            'App\\Models\\Sponsor' => 'Patrocinador',
            'App\\Models\\Certificate' => 'Constancia',
            'App\\Models\\EventBudget' => 'Presupuesto',
            'App\\Models\\EventExpense' => 'Gasto',
            'catalog' => 'Catálogo',
        ];

        $eventLabelMap = [
            'created' => 'Creado',
            'updated' => 'Actualizado',
            'deleted' => 'Eliminado',
            'restored' => 'Restaurado',
        ];

        return Inertia::render('admin/administration/audit', [
            'activities' => $activities->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type ?? (str_starts_with($activity->description ?? '', 'Catálogo:') ? 'catalog' : null),
                'subject_label' => $activity->subject_type
                    ? ($modelLabelMap[$activity->subject_type] ?? class_basename($activity->subject_type))
                    : (str_starts_with($activity->description ?? '', 'Catálogo:') ? 'Catálogo' : 'Sistema'),
                'subject_id' => $activity->subject_id,
                'event' => $activity->event,
                'event_label' => $eventLabelMap[$activity->event] ?? $activity->event,
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->id,
                    'name' => $activity->causer->name,
                    'email' => $activity->causer->email,
                ] : null,
                'properties' => $activity->properties,
                'attribute_changes' => $activity->attribute_changes,
                'created_at' => $activity->created_at->toISOString(),
                'created_at_human' => $activity->created_at->diffForHumans(),
            ]),
            'filters' => [
                'users' => $users,
                'modelTypes' => $modelTypes,
                'events' => $events,
                'eventList' => $eventList,
                'modelLabelMap' => $modelLabelMap,
                'eventLabelMap' => $eventLabelMap,
            ],
            'activeFilters' => $request->only([
                'causer_id', 'subject_type', 'event', 'date_from', 'date_to', 'search', 'event_filter',
            ]),
        ]);
    }
}
