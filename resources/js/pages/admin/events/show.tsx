import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Plus,
    Pencil,
    Trash2,
    Layers,
    Loader2,
    Mic,
    Wrench,
    Trophy,
    Code2,
    MessageSquare,
    Handshake,
    Image as ImageIcon,
    BookOpen,
    GraduationCap,
    Theater,
    Music,
    ClipboardList,
    UserPlus,
    Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import BulkRegistrationModal from '@/components/admin/bulk-registration-modal';
import RegistrationModal from '@/components/admin/registration-modal';
import SpeakerFormModal from '@/components/admin/speaker-form-modal';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

const TABS = [
    'info',
    'actividades',
    'asistentes',
    'ponentes',
    'certificados',
    'encuestas',
    'presupuestos',
    'patrocinadores',
];
const STATUS_LABELS: Record<string, string> = {
    draft: 'Borrador',
    pending_review: 'Pendiente',
    approved: 'Aprobado',
    published: 'Publicado',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
};
const TYPE_ICON_MAP: Record<string, React.ElementType> = {
    conference: Mic,
    workshop: Wrench,
    contest: Trophy,
    hackathon: Code2,
    panel: MessageSquare,
    round_table: MessageSquare,
    networking: Handshake,
    exhibition: ImageIcon,
    course: BookOpen,
    seminar: GraduationCap,
    ceremony: Theater,
    performance: Music,
    meeting: ClipboardList,
    other: Layers,
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    attended: 'bg-blue-100 text-blue-700',
};
const TYPE_LABELS: Record<string, string> = {
    student: 'Est.',
    staff: 'Pers.',
    external: 'Ext.',
};

export default function EventShow({
    event,
    tab,
    activities,
    tracks,
    activityTypes,
    rooms,
    registrations,
    speakers,
    eventActivities,
    certificates,
    eventParticipants,
    certificateTypes,
    existingCertificates,
    surveys,
    budget,
    expenses,
    categories,
    sponsors,
}: any) {
    const activeTab = tab ?? 'info';

    return (
        <div className="space-y-4">
            <Head title={`${event.title}`} />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link
                    href="/admin/events"
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                    Eventos
                </Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">
                    {event.title}
                </span>
                <div className="flex-1" />
                <Link
                    href={`/admin/events/${event.uuid}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-[#001e38] hover:text-[#001e38] dark:border-gray-700 dark:hover:border-[#dcc355] dark:hover:text-[#dcc355]"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                    Editar
                </Link>
            </div>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(key) =>
                    router.visit(`/admin/events/${event.uuid}?tab=${key}`)
                }
                className="w-full"
            >
                <TabsList>
                    {TABS.map((t) => (
                        <TabsTrigger key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {TABS.map((t) => (
                    <TabsContent key={t} value={t} className="pt-4">
                        {t === 'info' && (
                            <InfoTab event={event} tracks={tracks} />
                        )}
                        {t === 'actividades' && (
                            <ActivitiesTab
                                event={event}
                                activities={activities}
                                tracks={tracks}
                                activityTypes={activityTypes}
                                rooms={rooms}
                            />
                        )}
                        {t === 'asistentes' && (
                            <RegistrationsTab
                                event={event}
                                registrations={registrations}
                            />
                        )}
                        {t === 'ponentes' && (
                            <SpeakersTab
                                event={event}
                                speakers={speakers}
                                eventActivities={eventActivities}
                            />
                        )}
                        {t === 'certificados' && (
                            <CertificatesTab
                                event={event}
                                certificates={certificates}
                                eventParticipants={eventParticipants}
                                certificateTypes={certificateTypes}
                                eventActivities={eventActivities}
                                existingCertificates={existingCertificates}
                            />
                        )}
                        {t === 'encuestas' && (
                            <EncuestasTab event={event} surveys={surveys} />
                        )}
                        {t === 'presupuestos' && (
                            <PresupuestosTab
                                event={event}
                                budget={budget}
                                expenses={expenses}
                                categories={categories}
                                sponsors={sponsors}
                            />
                        )}
                        {t === 'patrocinadores' && (
                            <SponsorsTab event={event} sponsors={sponsors} />
                        )}
                        {![
                            'info',
                            'actividades',
                            'asistentes',
                            'ponentes',
                            'certificados',
                            'encuestas',
                            'presupuestos',
                            'patrocinadores',
                        ].includes(t) && (
                            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Modulo en desarrollo
                                </p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

/* INFO TAB */
function InfoTab({ event, tracks }: any) {
    const hasTracks = tracks?.length > 0;

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-3 text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">
                    {event.short_description}
                </p>
                {event.description && (
                    <p className="mt-3 text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                        {event.description}
                    </p>
                )}

                {hasTracks && (
                    <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Ejes Tematicos ({tracks.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {tracks.map((t: any) => (
                                <span
                                    key={t.id}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <svg
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400"
                                    >
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <dl className="space-y-3 text-sm">
                    <div>
                        <dt className="text-xs text-gray-400">Estado</dt>
                        <dd className="mt-0.5 font-medium">
                            {STATUS_LABELS[event.status] ?? event.status}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-400">Fecha</dt>
                        <dd className="mt-0.5">
                            {event.starts_at
                                ? new Date(event.starts_at).toLocaleDateString(
                                      'es-MX',
                                  )
                                : ''}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-gray-400">Capacidad</dt>
                        <dd className="mt-0.5">
                            {event.capacity ?? 'Ilimitada'}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

/*  ACTIVITIES TAB  */
function ActivitiesTab({
    event,
    activities,
    tracks,
    activityTypes,
    rooms,
}: any) {
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState<any>(null);

    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'title',
                label: 'Actividad',
                sortable: true,
                render: (a: any) => (
                    <span className="inline-flex items-center gap-2 font-medium text-[#001e38] dark:text-[#dcc355]">
                        {React.createElement(
                            TYPE_ICON_MAP[a.type_code] ?? Layers,
                            { size: 14, className: 'shrink-0' },
                        )}
                        {a.title}
                    </span>
                ),
            },
            {
                key: 'type_name',
                label: 'Tipo',
                sortable: true,
                filterable: true,
                filterOptions: (activityTypes ?? []).map((t: any) => ({
                    label: t.name,
                    value: t.name,
                })),
                render: (a: any) => (
                    <span className="text-xs text-gray-500">
                        {a.type_name ?? ''}
                    </span>
                ),
            },
            {
                key: 'track_name',
                label: 'Eje',
                sortable: true,
                filterOptions: (tracks ?? []).map((t: any) => ({
                    label: t.name,
                    value: t.name,
                })),
                render: (a: any) => (
                    <span className="text-xs text-gray-500">
                        {a.track_name ?? ''}
                    </span>
                ),
            },
            {
                key: 'starts_at',
                label: 'Horario',
                sortable: true,
                render: (a: any) => (
                    <span className="text-xs text-gray-500">
                        {a.starts_at
                            ? new Date(a.starts_at).toLocaleDateString(
                                  'es-MX',
                                  {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  },
                              )
                            : ''}
                    </span>
                ),
            },
            {
                key: 'room_name',
                label: 'Sala',
                sortable: true,
                filterOptions: (rooms ?? []).map((r: any) => ({
                    label: r.name,
                    value: r.name,
                })),
                render: (a: any) => (
                    <span className="text-xs text-gray-500">
                        {a.room_name ?? ''}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (a: any) => (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            onClick={() => {
                                setEditingActivity(a);
                                setShowForm(true);
                            }}
                            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <Pencil size={14} />
                        </button>
                        <DeleteActivityButton
                            eventUuid={event.uuid}
                            activityUuid={a.uuid}
                        />
                    </div>
                ),
            },
        ],
        [event.uuid, activityTypes, tracks, rooms],
    );

    if (showForm) {
        return (
            <ActivityFormModal
                event={event}
                activity={editingActivity}
                tracks={tracks}
                activityTypes={activityTypes}
                rooms={rooms}
                onClose={() => {
                    setShowForm(false);
                    setEditingActivity(null);
                }}
            />
        );
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                    {activities?.length ?? 0} actividades
                </h3>
                <div className="flex-1" />
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    <Plus size={16} /> Nueva Actividad
                </button>
            </div>

            <DataTable
                columns={columns}
                data={activities ?? []}
                searchPlaceholder="Buscar actividad..."
                emptyMessage="Sin actividades — agrega conferencias, talleres, concursos y más."
                ariaLabel="Actividades del evento"
            />
        </div>
    );
}

/*  Activity Form (inline modal)  */
function ActivityFormModal({
    event,
    activity,
    tracks,
    activityTypes,
    rooms,
    onClose,
}: any) {
    const isEdit = !!activity;
    const { data, setData, post, put, processing } = useForm({
        title: activity?.title ?? '',
        activity_type_id: activity?.activity_type_id?.toString() ?? '',
        track_id: activity?.track_id?.toString() ?? '',
        description: activity?.description ?? '',
        capacity: activity?.capacity ?? '',
        starts_at: activity?.starts_at?.slice(0, 16) ?? '',
        ends_at: activity?.ends_at?.slice(0, 16) ?? '',
        room_id: activity?.room_id?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const base = `/admin/events/${event.uuid}/activities`;
        const opts = { onSuccess: onClose };

        if (isEdit) {
            put(`${base}/${activity.uuid}`, opts);
        } else {
            post(base, opts);
        }
    };

    const selectedType = activityTypes?.find(
        (t: any) => t.id.toString() === data.activity_type_id,
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                    {isEdit ? 'Editar Actividad' : 'Nueva Actividad'}
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded p-1 text-gray-400 hover:text-gray-600"
                ></button>
            </div>

            <div className="grid gap-4">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                        Titulo *
                    </label>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Tipo *
                        </label>
                        <select
                            value={data.activity_type_id}
                            onChange={(e) =>
                                setData('activity_type_id', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                            required
                        >
                            <option value="">Seleccionar...</option>
                            {activityTypes?.map((t: any) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Eje Temático
                        </label>
                        <select
                            value={data.track_id}
                            onChange={(e) =>
                                setData('track_id', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">Sin eje</option>
                            {tracks?.map((t: any) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {selectedType && (
                    <div className="flex gap-2 text-xs">
                        {selectedType.supports_speakers && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                Ponentes
                            </span>
                        )}
                        {selectedType.supports_teams && (
                            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                Equipos
                            </span>
                        )}
                        {selectedType.supports_certificates && (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                Constancias
                            </span>
                        )}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Inicio *
                        </label>
                        <input
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(e) =>
                                setData('starts_at', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Fin
                        </label>
                        <input
                            type="datetime-local"
                            value={data.ends_at}
                            onChange={(e) => setData('ends_at', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Sala
                        </label>
                        <select
                            value={data.room_id}
                            onChange={(e) => setData('room_id', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">Sin asignar</option>
                            {rooms?.map((r: any) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Capacidad
                        </label>
                        <input
                            type="number"
                            value={data.capacity}
                            onChange={(e) =>
                                setData('capacity', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    {processing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {isEdit ? 'Actualizar' : 'Crear Actividad'}
                </button>
            </div>
        </form>
    );
}

/*  Delete Activity (inline confirm)  */
function DeleteActivityButton({
    eventUuid,
    activityUuid,
}: {
    eventUuid: string;
    activityUuid: string;
}) {
    const { delete: destroy, processing } = useForm();
    const [confirm, setConfirm] = useState(false);

    if (confirm) {
        return (
            <span className="inline-flex items-center gap-1 text-xs">
                <span className="text-gray-400">Eliminar?</span>
                <button
                    onClick={() =>
                        destroy(
                            `/admin/events/${eventUuid}/activities/${activityUuid}`,
                            { preserveState: true, preserveScroll: true },
                        )
                    }
                    disabled={processing}
                    className="font-medium text-red-500 hover:text-red-700"
                >
                    Si
                </button>
                <button
                    onClick={() => setConfirm(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    No
                </button>
            </span>
        );
    }

    return (
        <button
            onClick={() => setConfirm(true)}
            className="rounded p-1 text-gray-400 hover:text-red-500"
        >
            <Trash2 size={14} />
        </button>
    );
}

/* REGISTRATIONS TAB */
function RegistrationsTab({ event, registrations }: any) {
    const [showModal, setShowModal] = useState(false);
    const [showBulk, setShowBulk] = useState(false);

    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'name',
                label: 'Participante',
                sortable: true,
                render: (r: any) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-[#001e38] dark:text-[#dcc355]">
                            {r.first_name} {r.last_name}
                        </span>
                        <span className="text-xs text-gray-400">{r.email}</span>
                    </div>
                ),
            },
            {
                key: 'type',
                label: 'Tipo',
                sortable: true,
                filterable: true,
                filterOptions: [
                    { label: 'Estudiante', value: 'student' },
                    { label: 'Personal', value: 'staff' },
                    { label: 'Externo', value: 'external' },
                ],
                render: (r: any) => (
                    <span className="text-xs text-gray-500">
                        {TYPE_LABELS[r.type] ?? r.type}
                        {r.organization_acronym && (
                            <span className="ml-1 text-gray-400">
                                ({r.organization_acronym})
                            </span>
                        )}
                    </span>
                ),
            },
            {
                key: 'status',
                label: 'Estado',
                sortable: true,
                filterable: true,
                filterOptions: [
                    { label: 'Pendiente', value: 'pending' },
                    { label: 'Confirmado', value: 'confirmed' },
                    { label: 'Cancelado', value: 'cancelled' },
                    { label: 'Asistió', value: 'attended' },
                ],
                render: (r: any) => (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status] ?? ''}`}
                    >
                        {r.status === 'pending' && 'Pendiente'}
                        {r.status === 'confirmed' && 'Confirmado'}
                        {r.status === 'cancelled' && 'Cancelado'}
                        {r.status === 'attended' && 'Asistió'}
                    </span>
                ),
            },
            {
                key: 'registered_at',
                label: 'Registrado',
                sortable: true,
                render: (r: any) => (
                    <span className="text-xs text-gray-500">
                        {r.registered_at
                            ? new Date(r.registered_at).toLocaleDateString(
                                  'es-MX',
                                  {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  },
                              )
                            : ''}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (r: any) => (
                    <RegistrationActions
                        eventUuid={event.uuid}
                        registration={r}
                    />
                ),
            },
        ],
        [event.uuid],
    );

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                    {registrations?.total ?? 0} asistentes
                </h3>
                <div className="flex-1" />
                <button
                    onClick={() => setShowBulk(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <Users size={16} /> Registro Masivo
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    <UserPlus size={16} /> Registrar
                </button>
            </div>

            <DataTable
                columns={columns}
                data={registrations?.data ?? []}
                searchPlaceholder="Buscar participante..."
                searchKeys={['first_name', 'last_name', 'email']}
                emptyMessage="Sin asistentes aún"
                ariaLabel="Asistentes del evento"
            />

            {showModal && (
                <RegistrationModal
                    eventUuid={event.uuid}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showBulk && (
                <BulkRegistrationModal
                    eventUuid={event.uuid}
                    onClose={() => setShowBulk(false)}
                />
            )}
        </div>
    );
}

/* Registration Actions */
const STATUS_FLOW = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'attended', label: 'Asistió' },
];

function RegistrationActions({
    eventUuid,
    registration,
}: {
    eventUuid: string;
    registration: any;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const changeStatus = (status: string) => {
        router.patch(
            `/admin/events/${eventUuid}/registrations/${registration.uuid}/status`,
            { status },
            { preserveState: true, preserveScroll: true },
        );
    };

    const deleteRegistration = () => {
        router.delete(
            `/admin/events/${eventUuid}/registrations/${registration.uuid}`,
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <select
                value={registration.status}
                onChange={(e) => changeStatus(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
                {STATUS_FLOW.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>

            {confirmDelete ? (
                <span className="inline-flex items-center gap-1 text-xs">
                    <span className="text-gray-400">Eliminar?</span>
                    <button
                        onClick={deleteRegistration}
                        className="font-medium text-red-500 hover:text-red-700"
                    >
                        Si
                    </button>
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        No
                    </button>
                </span>
            ) : (
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="rounded p-1 text-gray-300 hover:text-red-500"
                    title="Eliminar registro"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
}

/* SPEAKERS TAB */
function SpeakersTab({ event, speakers, eventActivities }: any) {
    const [showForm, setShowForm] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState<any>(null);

    const hasSpeakers = speakers?.length > 0;

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                    {speakers?.length ?? 0} ponentes
                </h3>
                <div className="flex-1" />
                <button
                    onClick={() => {
                        setEditingSpeaker(null);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    <UserPlus size={16} /> Agregar Ponente
                </button>
            </div>

            {!hasSpeakers ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Sin ponentes asignados
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Registra a los conferencistas, talleristas y panelistas.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ponente
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Organización
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actividades
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {speakers.map((s: any) => (
                                <tr
                                    key={s.uuid}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#001e38] dark:text-[#dcc355]">
                                                {s.first_name} {s.last_name}
                                            </span>
                                            {s.email && (
                                                <span className="text-xs text-gray-400">
                                                    {s.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {s.organization ? (
                                            <>
                                                {s.organization}
                                                {s.position ? (
                                                    <> — {s.position}</>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {s.activity_titles ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingSpeaker(s);
                                                    setShowForm(true);
                                                }}
                                                className="rounded p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <SpeakerFormModal
                    eventUuid={event.uuid}
                    speaker={editingSpeaker}
                    eventActivities={eventActivities ?? []}
                    onClose={() => {
                        setShowForm(false);
                        setEditingSpeaker(null);
                    }}
                />
            )}
        </div>
    );
}

/* CERTIFICATES TAB */
function CertificatesTab({
    event,
    certificates,
    eventParticipants,
    certificateTypes,
    eventActivities,
    existingCertificates,
}: any) {
    const [showGenerate, setShowGenerate] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState<string>('');
    const [selectedActivity, setSelectedActivity] = useState<string>('');
    const hasCertificates = certificates?.data?.length > 0;
    const hasActivities = eventActivities?.length > 0;

    const participantExistingCerts = selectedParticipant
        ? (existingCertificates?.[selectedParticipant] ?? [])
        : [];

    const [showBulk, setShowBulk] = useState(false);
    const [bulkGenerating, setBulkGenerating] = useState(false);

    const handleBulkGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBulkGenerating(true);
        const form = new FormData(e.currentTarget);
        router.post(
            `/admin/events/${event.uuid}/certificates/generate-bulk`,
            Object.fromEntries(form),
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setBulkGenerating(false);
                    setShowBulk(false);
                },
            },
        );
    };

    // Filter certificate types based on selected activity type
    const filteredTypes = React.useMemo(() => {
        const genericCodes = [
            'attendance',
            'participation',
            'organizer',
            'volunteer',
            'recognition',
        ];

        if (!hasActivities) {
            // Event without activities — all types available
            return certificateTypes ?? [];
        }

        if (!selectedActivity) {
            // Event-level certificate — only generic types
            return (certificateTypes ?? []).filter((t: any) =>
                genericCodes.includes(t.code),
            );
        }

        // Activity-specific certificate — generic + specific types
        const act = eventActivities.find(
            (a: any) => a.id.toString() === selectedActivity,
        );

        if (!act) {
            return certificateTypes ?? [];
        }

        const map: Record<string, string[]> = {
            conference: ['speaker'],
            workshop: ['speaker', 'workshop'],
            course: ['speaker', 'workshop'],
            contest: ['contest_winner'],
            hackathon: ['contest_winner'],
            panel: ['speaker'],
            round_table: ['speaker'],
            seminar: ['speaker'],
            ceremony: [],
        };

        const specificCodes = map[act.activity_type_code] ?? [];
        const allowedCodes = [...genericCodes, ...specificCodes];

        return (certificateTypes ?? []).filter((t: any) =>
            allowedCodes.includes(t.code),
        );
    }, [selectedActivity, hasActivities, eventActivities, certificateTypes]);

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGenerating(true);
        const form = new FormData(e.currentTarget);
        router.post(
            `/admin/events/${event.uuid}/certificates/generate`,
            Object.fromEntries(form),
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setGenerating(false);
                    setShowGenerate(false);
                    setSelectedParticipant('');
                    setSelectedActivity('');
                },
            },
        );
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {certificates?.total ?? 0} constancias
                </h3>
                <div className="flex-1" />
                <button
                    onClick={() => setShowBulk(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Generación masiva
                </button>
                <button
                    onClick={() => setShowGenerate(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    + Generar constancia
                </button>
            </div>

            {!hasCertificates ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Sin constancias generadas
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Las constancias se generan automáticamente en PDF con
                        folio único y código QR.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Folio
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Participante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actividad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Generada
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {certificates.data.map((c: any) => (
                                <tr
                                    key={c.uuid}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs font-medium text-[#001e38] dark:text-[#dcc355]">
                                            {c.folio}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {c.first_name} {c.last_name}
                                            </span>
                                            {c.email && (
                                                <span className="text-xs text-gray-400">
                                                    {c.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {c.certificate_type_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {c.activity_title ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {c.generated_at
                                            ? new Date(
                                                  c.generated_at,
                                              ).toLocaleDateString('es-MX')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <a
                                                href={`/admin/certificates/${c.uuid}/download`}
                                                className="rounded p-1 text-gray-400 hover:text-gray-600"
                                                title="Descargar PDF"
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line
                                                        x1="12"
                                                        y1="15"
                                                        x2="12"
                                                        y2="3"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showGenerate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                            <h2 className="text-sm font-semibold">
                                Generar constancia
                            </h2>
                            <button
                                onClick={() => setShowGenerate(false)}
                                className="rounded p-1 text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleGenerate}
                            className="space-y-4 p-5"
                        >
                            {/* Participant */}
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Participante
                                </label>
                                <select
                                    name="participant_id"
                                    required
                                    value={selectedParticipant}
                                    onChange={(e) => {
                                        setSelectedParticipant(e.target.value);
                                        setSelectedActivity('');
                                    }}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#001e38] focus:ring-1 focus:ring-[#001e38] dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">
                                        Seleccionar participante...
                                    </option>
                                    {eventParticipants?.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.first_name} {p.last_name} —{' '}
                                            {p.email}
                                        </option>
                                    ))}
                                </select>

                                {/* Existing certificates for selected participant */}
                                {participantExistingCerts.length > 0 && (
                                    <div className="mt-2 rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
                                        <p className="text-[10px] font-medium text-yellow-700 dark:text-yellow-400">
                                            Constancias existentes:
                                        </p>
                                        <ul className="mt-1 space-y-0.5">
                                            {participantExistingCerts.map(
                                                (ec: any, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="text-[10px] text-yellow-600 dark:text-yellow-500"
                                                    >
                                                        • {ec.type_name}
                                                        {ec.activity_id
                                                            ? ` — Actividad #${ec.activity_id}`
                                                            : ' — Evento general'}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Activity (only when event has activities) */}
                            {hasActivities && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500">
                                        Actividad
                                    </label>
                                    <select
                                        name="activity_id"
                                        value={selectedActivity}
                                        onChange={(e) =>
                                            setSelectedActivity(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#001e38] focus:ring-1 focus:ring-[#001e38] dark:border-gray-600 dark:bg-gray-800"
                                    >
                                        <option value="">
                                            Evento general — sin actividad
                                            específica
                                        </option>
                                        {eventActivities?.map((a: any) => (
                                            <option key={a.id} value={a.id}>
                                                {a.title} (
                                                {a.activity_type_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Certificate type */}
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Tipo de constancia
                                </label>
                                <select
                                    name="certificate_type_id"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#001e38] focus:ring-1 focus:ring-[#001e38] dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">
                                        Tipo por defecto (Asistencia)
                                    </option>
                                    {filteredTypes?.map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowGenerate(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                                >
                                    {generating ? 'Generando...' : 'Generar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk generation modal */}
            {showBulk && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                            <h2 className="text-sm font-semibold">
                                Generación masiva
                            </h2>
                            <button
                                onClick={() => setShowBulk(false)}
                                className="rounded p-1 text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleBulkGenerate}
                            className="space-y-4 p-5"
                        >
                            <p className="text-xs text-gray-500">
                                Generará constancias para todos los
                                participantes registrados en el evento. Los
                                participantes que ya tengan una constancia del
                                mismo tipo serán omitidos.
                            </p>

                            {/* Activity (only when event has activities) */}
                            {hasActivities && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500">
                                        Actividad
                                    </label>
                                    <select
                                        name="activity_id"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#001e38] focus:ring-1 focus:ring-[#001e38] dark:border-gray-600 dark:bg-gray-800"
                                    >
                                        <option value="">Evento general</option>
                                        {eventActivities?.map((a: any) => (
                                            <option key={a.id} value={a.id}>
                                                {a.title} (
                                                {a.activity_type_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Tipo de constancia
                                </label>
                                <select
                                    name="certificate_type_id"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#001e38] focus:ring-1 focus:ring-[#001e38] dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">
                                        Tipo por defecto (Asistencia)
                                    </option>
                                    {certificateTypes?.map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowBulk(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={bulkGenerating}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                                >
                                    {bulkGenerating
                                        ? 'Generando...'
                                        : 'Generar todas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

/* SURVEYS TAB */
function EncuestasTab({ event, surveys }: any) {
    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {surveys?.length ?? 0} encuestas
                </h3>
                <div className="flex-1" />
                <a
                    href={`/admin/surveys/create?event_id=${event.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    + Nueva encuesta
                </a>
            </div>

            {!surveys?.length ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Sin encuestas registradas
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Crea encuestas de satisfacción, feedback y evaluación
                        para este evento.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Encuesta
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actividad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Obligatoria
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {surveys.map((s: any) => (
                                <tr
                                    key={s.uuid}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <a
                                            href={`/admin/surveys/${s.uuid}`}
                                            className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                                        >
                                            {s.title}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {s.activity_title ?? 'Evento general'}
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {s.is_required ? (
                                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                                Obligatoria
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                Opcional
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a
                                            href={`/admin/surveys/${s.uuid}/edit`}
                                            className="text-xs text-gray-400 hover:text-gray-600"
                                        >
                                            Editar
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* BUDGETS TAB */
/* PATROCINADORES TAB */
const SPONSORSHIP_TYPES: Record<string, string> = {
    financial: 'Financiero',
    in_kind: 'En especie',
    media: 'Medios',
    academic: 'Académico',
    venue: 'Sede',
};
const SPONSOR_STATUS: Record<string, string> = {
    prospective: 'Prospecto',
    confirmed: 'Confirmado',
    active: 'Activo',
    completed: 'Completado',
    cancelled: 'Cancelado',
};
const SPONSOR_STATUS_COLORS: Record<string, string> = {
    prospective: 'bg-gray-100 text-gray-600',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
};

function SponsorsTab({ event, sponsors }: any) {
    const [showForm, setShowForm] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<any>(null);

    const hasSponsors = sponsors?.length > 0;

    const totalContributions =
        sponsors
            ?.filter((s: any) => s.sponsorship_type === 'financial')
            .reduce(
                (sum: number, s: any) =>
                    sum + parseFloat(s.contribution_value ?? 0),
                0,
            ) ?? 0;

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {sponsors?.length ?? 0} patrocinadores
                </h3>
                <div className="flex-1" />
                {!hasSponsors ? null : (
                    <span className="text-xs text-gray-400">
                        Aportes:{' '}
                        <strong className="text-green-600">
                            ${totalContributions.toLocaleString('es-MX')}
                        </strong>
                    </span>
                )}
                <button
                    onClick={() => {
                        setEditingSponsor(null);
                        setShowForm(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    + Agregar patrocinador
                </button>
            </div>

            {!hasSponsors ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Sin patrocinadores registrados
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Agrega patrocinadores financieros, en especie, medios y
                        más.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sponsors.map((s: any) => (
                        <div
                            key={s.id}
                            className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900 ${
                                s.deleted_at
                                    ? 'border-red-200 opacity-50 dark:border-red-800'
                                    : 'border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {s.logo_url ? (
                                        <img
                                            src={s.logo_url}
                                            alt={s.name}
                                            crossOrigin="anonymous"
                                            referrerPolicy="no-referrer"
                                            className="h-10 w-10 rounded-lg object-contain"
                                            onError={(e) => {
                                                (
                                                    e.target as HTMLImageElement
                                                ).style.display = 'none';
                                                (
                                                    e.target as HTMLImageElement
                                                ).nextElementSibling?.classList.remove(
                                                    'hidden',
                                                );
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`${s.logo_url ? 'hidden' : ''} flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800`}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                            />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {s.name}
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            {
                                                SPONSORSHIP_TYPES[
                                                    s.sponsorship_type
                                                ]
                                            }
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                        SPONSOR_STATUS_COLORS[s.status] ?? ''
                                    }`}
                                >
                                    {SPONSOR_STATUS[s.status] ?? s.status}
                                </span>
                            </div>

                            {s.contribution_value > 0 && (
                                <p className="mb-2 text-lg font-bold text-green-600">
                                    $
                                    {parseFloat(
                                        s.contribution_value,
                                    ).toLocaleString('es-MX')}
                                </p>
                            )}

                            {s.contribution_description && (
                                <p className="mb-2 line-clamp-2 text-xs text-gray-500">
                                    {s.contribution_description}
                                </p>
                            )}

                            {s.website && (
                                <a
                                    href={s.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-2 block text-xs text-[#001e38] hover:underline dark:text-[#dcc355]"
                                >
                                    {s.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}

                            <div className="mt-2 flex items-center justify-end gap-1 border-t border-gray-100 pt-2 dark:border-gray-800">
                                {s.deleted_at ? (
                                    <button
                                        onClick={() =>
                                            router.patch(
                                                `/admin/events/${event.id}/sponsors/${s.id}`,
                                                {
                                                    status: 'prospective',
                                                    deleted_at: null,
                                                },
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            )
                                        }
                                        className="rounded p-1 text-green-500 hover:text-green-700"
                                        title="Restaurar"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="1 4 1 10 7 10" />
                                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                        </svg>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingSponsor(s);
                                                setShowForm(true);
                                            }}
                                            className="rounded p-1 text-gray-400 hover:text-gray-600"
                                            title="Editar"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </button>
                                        <DeleteSponsorButton
                                            eventId={event.id}
                                            sponsorId={s.id}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <SponsorFormModal
                    eventId={event.id}
                    sponsor={editingSponsor}
                    onClose={() => {
                        setShowForm(false);
                        setEditingSponsor(null);
                    }}
                />
            )}
        </div>
    );
}

function DeleteSponsorButton({
    eventId,
    sponsorId,
}: {
    eventId: number;
    sponsorId: number;
}) {
    const [confirming, setConfirming] = useState(false);

    if (confirming) {
        return (
            <span className="inline-flex items-center gap-1 text-xs">
                <span className="text-gray-400">Eliminar?</span>
                <button
                    onClick={() =>
                        router.delete(
                            `/admin/events/${eventId}/sponsors/${sponsorId}`,
                            { preserveScroll: true, preserveState: true },
                        )
                    }
                    className="font-medium text-red-500 hover:text-red-700"
                >
                    Si
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    No
                </button>
            </span>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="rounded p-1 text-gray-400 hover:text-red-500"
            title="Eliminar"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
        </button>
    );
}

function SponsorFormModal({ eventId, sponsor, onClose }: any) {
    const isEdit = !!sponsor;
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) {
            return;
        }

        const fd = new FormData(formRef.current);
        const data: Record<string, any> = {};

        for (const [key, value] of fd.entries()) {
            data[key] = value;
        }

        const url = isEdit
            ? `/admin/events/${eventId}/sponsors/${sponsor.id}`
            : `/admin/events/${eventId}/sponsors`;

        if (isEdit) {
            router.patch(url, data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            router.post(url, data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Editar patrocinador' : 'Nuevo patrocinador'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Nombre *
                        </label>
                        <input
                            name="name"
                            defaultValue={sponsor?.name ?? ''}
                            required
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Tipo de patrocinio *
                        </label>
                        <select
                            name="sponsorship_type"
                            defaultValue={
                                sponsor?.sponsorship_type ?? 'financial'
                            }
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        >
                            {Object.entries(SPONSORSHIP_TYPES).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            URL del logo
                        </label>
                        <input
                            name="logo_url"
                            defaultValue={sponsor?.logo_url ?? ''}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Sitio web
                        </label>
                        <input
                            name="website"
                            defaultValue={sponsor?.website ?? ''}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Valor de la aportación ($)
                        </label>
                        <input
                            name="contribution_value"
                            type="number"
                            step="0.01"
                            defaultValue={sponsor?.contribution_value ?? ''}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Descripción del aporte
                        </label>
                        <textarea
                            name="contribution_description"
                            defaultValue={
                                sponsor?.contribution_description ?? ''
                            }
                            rows={3}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Contacto
                            </label>
                            <input
                                name="contact_name"
                                defaultValue={sponsor?.contact_name ?? ''}
                                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Email
                            </label>
                            <input
                                name="contact_email"
                                type="email"
                                defaultValue={sponsor?.contact_email ?? ''}
                                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Teléfono
                        </label>
                        <input
                            name="contact_phone"
                            defaultValue={sponsor?.contact_phone ?? ''}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    {isEdit && (
                        <div className="grid gap-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Estado
                            </label>
                            <select
                                name="status"
                                defaultValue={sponsor?.status ?? 'prospective'}
                                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                            >
                                {Object.entries(SPONSOR_STATUS).map(
                                    ([k, v]) => (
                                        <option key={k} value={k}>
                                            {v}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                            Notas
                        </label>
                        <textarea
                            name="notes"
                            defaultValue={sponsor?.notes ?? ''}
                            rows={2}
                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                    <input type="hidden" name="event_id" value={eventId} />
                </form>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => formRef.current?.requestSubmit()}>
                        {isEdit ? 'Actualizar' : 'Agregar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ExportDropdown({ onExportCSV, onExportExcel, onExportPDF }: any) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Exportar
            </button>
            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <button
                            onClick={() => {
                                onExportCSV();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            CSV
                        </button>
                        <button
                            onClick={() => {
                                onExportExcel();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            Excel
                        </button>
                        <button
                            onClick={() => {
                                onExportPDF();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function PresupuestosTab({
    event,
    budget,
    expenses,
    categories,
    sponsors,
}: any) {
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [showBudgetForm, setShowBudgetForm] = useState(false);
    const [showInactive, setShowInactive] = useState(false);

    const activeExpenses = (expenses ?? []).filter(
        (e: any) => e.status !== 'cancelled',
    );
    const inactiveExpenses = (expenses ?? []).filter(
        (e: any) => e.status === 'cancelled',
    );
    const visibleExpenses = showInactive ? (expenses ?? []) : activeExpenses;

    const totalExpenses =
        expenses
            ?.filter((e: any) => e.status !== 'cancelled')
            .reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0) ??
        0;
    const approved = parseFloat(
        budget?.approved_amount ?? budget?.planned_amount ?? 0,
    );
    const planned = parseFloat(budget?.planned_amount ?? 0);
    const sponsorIncome =
        sponsors?.reduce(
            (sum: number, s: any) =>
                sum + parseFloat(s.contribution_value ?? 0),
            0,
        ) ?? 0;
    const totalBudget = approved + sponsorIncome;
    const remaining = totalBudget - totalExpenses;
    const progressPercent =
        totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    const statusLabel = (s: string) =>
        s === 'paid' ? 'Pagado' : s === 'cancelled' ? 'Cancelado' : 'Pendiente';

    const downloadBlob = (content: string, type: string, ext: string) => {
        const blob = new Blob(['\uFEFF' + content], {
            type: type + ';charset=utf-8',
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `presupuesto-${event.title?.replace(/[^a-z0-9]/gi, '_') ?? 'evento'}.${ext}`;
        a.click();
    };

    const exportCSV = () => {
        const sep = ';';
        const rows = [
            `Presupuesto: ${event.title}`,
            `Planeado${sep}${planned.toLocaleString('es-MX')}`,
            `Aprobado${sep}${approved.toLocaleString('es-MX')}`,
            `Ingresos${sep}${sponsorIncome.toLocaleString('es-MX')}`,
            `Gastado${sep}${totalExpenses.toLocaleString('es-MX')}`,
            `Restante${sep}${remaining.toLocaleString('es-MX')}`,
            `Ejecución${sep}${progressPercent.toFixed(1)}%`,
            '',
            [
                'Concepto',
                'Categoría',
                'Monto',
                'Estado',
                'Fecha',
                'Proveedor',
            ].join(sep),
        ];

        for (const e of expenses ?? []) {
            rows.push(
                [
                    e.concept ?? '',
                    e.category_name ?? 'Sin categoría',
                    parseFloat(e.amount).toLocaleString('es-MX'),
                    statusLabel(e.status),
                    e.expense_date
                        ? new Date(e.expense_date).toLocaleDateString('es-MX')
                        : '',
                    e.vendor_name ?? '',
                ].join(sep),
            );
        }

        downloadBlob(rows.join('\n'), 'text/csv', 'csv');
    };

    const exportExcel = async () => {
        // Load SheetJS from CDN on first use
        const XLSX =
            (window as any).XLSX ||
            (await new Promise<any>((resolve) => {
                const script = document.createElement('script');
                script.src =
                    'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
                script.onload = () => resolve((window as any).XLSX);
                document.head.appendChild(script);
            }));

        const wb = XLSX.utils.book_new();
        const safeTitle = event.title?.replace(/[\\[\]*?:/]/g, '-') ?? 'evento';

        // ── Resumen sheet ──
        const resumenRows = [
            [`Presupuesto: ${event.title}`],
            [],
            ['Concepto', 'Monto'],
            ['Planeado', planned],
            ['Aprobado', approved],
            ['Ingresos', sponsorIncome],
            ['Gastado', totalExpenses],
            ['Restante', remaining],
            ['Ejecución', `${progressPercent.toFixed(1)}%`],
        ];
        const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
        wsResumen['!cols'] = [{ wch: 16 }, { wch: 18 }];
        wsResumen['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

        // ── Gastos sheet ──
        const gastosRows = [
            ['Concepto', 'Categoría', 'Monto', 'Estado', 'Fecha', 'Proveedor'],
        ];

        for (const e of expenses ?? []) {
            gastosRows.push([
                e.concept ?? '',
                e.category_name ?? 'Sin categoría',
                parseFloat(e.amount),
                statusLabel(e.status),
                e.expense_date ?? '',
                e.vendor_name ?? '',
            ]);
        }

        const wsGastos = XLSX.utils.aoa_to_sheet(gastosRows);
        wsGastos['!cols'] = [
            { wch: 24 },
            { wch: 16 },
            { wch: 14 },
            { wch: 14 },
            { wch: 14 },
            { wch: 20 },
        ];

        // Format amount column as currency
        const amountCol = 2;

        for (let r = 1; r < gastosRows.length; r++) {
            const cell = XLSX.utils.encode_cell({ r, c: amountCol });

            if (wsGastos[cell]) {
                wsGastos[cell].z = '$#,##0.00';
            }
        }

        // Format date column
        const dateCol = 4;

        for (let r = 1; r < gastosRows.length; r++) {
            const cell = XLSX.utils.encode_cell({ r, c: dateCol });

            if (wsGastos[cell] && wsGastos[cell].v) {
                wsGastos[cell].z = 'dd/mm/yyyy';
            }
        }

        XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');

        XLSX.writeFile(wb, `presupuesto-${safeTitle}.xlsx`);
    };

    const exportPDF = () => {
        const w = window.open('', '_blank', 'width=900,height=700');

        if (!w) {
            return;
        }

        w.document.write(`
            <html><head><meta charset="UTF-8"><title>Presupuesto - ${event.title}</title>
            <style>
                body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; }
                h1 { font-size: 1.2rem; margin-bottom: 0.5rem; }
                .summary { display: flex; gap: 2rem; margin-bottom: 1.5rem; }
                .summary div { font-size: 0.85rem; }
                .summary strong { display: block; font-size: 1.1rem; margin-top: 0.15rem; }
                table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
                th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
                th { background: #f5f5f5; font-weight: 600; }
                @media print { body { padding: 1rem; } }
            </style></head><body>
            <h1>Presupuesto: ${event.title}</h1>
            <div class="summary">
                <div>Planeado<strong>$${planned.toLocaleString('es-MX')}</strong></div>
                <div>Aprobado<strong>$${approved.toLocaleString('es-MX')}</strong></div>
                <div>Ingresos<strong>$${sponsorIncome.toLocaleString('es-MX')}</strong></div>
                <div>Gastado<strong>$${totalExpenses.toLocaleString('es-MX')}</strong></div>
                <div>Restante<strong>$${remaining.toLocaleString('es-MX')}</strong></div>
                <div>Ejecución<strong>${progressPercent.toFixed(1)}%</strong></div>
            </div>
            <table>
                <thead><tr><th>Concepto</th><th>Categoría</th><th>Monto</th><th>Estado</th><th>Fecha</th><th>Proveedor</th></tr></thead>
                <tbody>${(expenses ?? []).map((e: any) => `<tr><td>${e.concept ?? ''}</td><td>${e.category_name ?? 'Sin categoría'}</td><td>$${parseFloat(e.amount).toLocaleString('es-MX')}</td><td>${statusLabel(e.status)}</td><td>${e.expense_date ? new Date(e.expense_date).toLocaleDateString('es-MX') : ''}</td><td>${e.vendor_name ?? ''}</td></tr>`).join('')}</tbody>
            </table>
            <script>window.print();</script>
            </body></html>
        `);
        w.document.close();
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Presupuesto
                </h3>
                <div className="flex-1" />
                {budget && (
                    <ExportDropdown
                        onExportCSV={exportCSV}
                        onExportExcel={exportExcel}
                        onExportPDF={exportPDF}
                    />
                )}
                {!budget ? (
                    <button
                        onClick={() => setShowBudgetForm(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                    >
                        + Crear presupuesto
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setEditingExpense(null);
                            setShowForm(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                    >
                        + Agregar gasto
                    </button>
                )}
            </div>

            {!budget ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        No se ha creado un presupuesto para este evento.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Define el monto planeado y agrega gastos detallados.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {[
                            { label: 'Planeado', value: planned },
                            { label: 'Aprobado', value: approved },
                            {
                                label: 'Ingresos',
                                value: sponsorIncome,
                                income: true,
                            },
                            {
                                label: 'Gastado',
                                value: totalExpenses,
                                danger: totalExpenses > totalBudget,
                            },
                            {
                                label: 'Restante',
                                value: remaining,
                                success: remaining >= 0,
                                danger: remaining < 0,
                            },
                        ].map(({ label, value, success, danger, income }) => (
                            <div
                                key={label}
                                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <p className="text-xs text-gray-400">{label}</p>
                                <p
                                    className={`mt-1 text-lg font-bold ${danger ? 'text-red-600' : success ? 'text-green-600' : income ? 'text-green-600' : 'text-foreground'}`}
                                >
                                    ${value.toLocaleString('es-MX')}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Ejecución</span>
                            <span>{progressPercent.toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                                className={`h-full rounded-full transition-all ${progressPercent > 100 ? 'bg-red-500' : progressPercent > 80 ? 'bg-yellow-500' : 'bg-[#001e38] dark:bg-[#dcc355]'}`}
                                style={{
                                    width: `${Math.min(progressPercent, 100)}%`,
                                }}
                            />
                        </div>
                    </div>

                    {remaining < 0 && (
                        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mt-0.5 shrink-0 text-red-500"
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                    Presupuesto excedido
                                </p>
                                <p className="mt-0.5 text-xs text-red-600 dark:text-red-400/80">
                                    Los gastos superan el presupuesto total{' '}
                                    (aprobado + ingresos) por{' '}
                                    <strong>
                                        $
                                        {Math.abs(remaining).toLocaleString(
                                            'es-MX',
                                        )}
                                    </strong>
                                    . Revisa los gastos o solicita una
                                    ampliación.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 flex items-center gap-2">
                        <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${budget.status === 'approved' ? 'bg-green-100 text-green-700' : budget.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                        >
                            {budget.status === 'draft'
                                ? 'Borrador'
                                : budget.status === 'submitted'
                                  ? 'En revisión'
                                  : budget.status === 'approved'
                                    ? 'Aprobado'
                                    : 'Rechazado'}
                        </span>
                        <button
                            onClick={() => setShowBudgetForm(true)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                        >
                            Editar presupuesto
                        </button>
                        {inactiveExpenses.length > 0 && (
                            <button
                                onClick={() => setShowInactive(!showInactive)}
                                className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                    showInactive
                                        ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500'
                                }`}
                            >
                                {showInactive
                                    ? `Ocultar ${inactiveExpenses.length} inactivos`
                                    : `${inactiveExpenses.length} cancelados`}
                            </button>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        {!visibleExpenses.length ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-gray-500">
                                    Sin gastos registrados
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Concepto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Categoría
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Monto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {(() => {
                                        let running = 0;
                                        const budgetLimit = Number(
                                            approved ?? planned ?? 0,
                                        );

                                        return visibleExpenses.map((e: any) => {
                                            running += parseFloat(e.amount);
                                            const isOver =
                                                budgetLimit > 0 &&
                                                running > budgetLimit;
                                            const prevRunning =
                                                running - parseFloat(e.amount);
                                            const crossedHere =
                                                isOver &&
                                                prevRunning <= budgetLimit;

                                            return (
                                                <tr
                                                    key={e.id}
                                                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isOver ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-medium text-foreground">
                                                                {e.concept}
                                                            </span>
                                                            {crossedHere && (
                                                                <span
                                                                    title="Excede el presupuesto"
                                                                    className="text-red-500"
                                                                >
                                                                    <svg
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                                        <line
                                                                            x1="12"
                                                                            y1="9"
                                                                            x2="12"
                                                                            y2="13"
                                                                        />
                                                                        <line
                                                                            x1="12"
                                                                            y1="17"
                                                                            x2="12.01"
                                                                            y2="17"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                            {e.over_budget_note && (
                                                                <span
                                                                    title={
                                                                        e.over_budget_note
                                                                    }
                                                                    className="cursor-help text-[10px] text-orange-500"
                                                                >
                                                                    📝
                                                                </span>
                                                            )}
                                                        </div>
                                                        {e.vendor_name && (
                                                            <span className="ml-2 text-xs text-gray-400">
                                                                {e.vendor_name}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">
                                                        {e.category_name ?? '—'}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs">
                                                        <span
                                                            className={
                                                                isOver
                                                                    ? 'text-red-600'
                                                                    : ''
                                                            }
                                                        >
                                                            $
                                                            {parseFloat(
                                                                e.amount,
                                                            ).toLocaleString(
                                                                'es-MX',
                                                            )}
                                                        </span>
                                                        {isOver && (
                                                            <span className="ml-1 text-[10px] text-red-400">
                                                                (acum: $
                                                                {running.toLocaleString(
                                                                    'es-MX',
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.status === 'paid' ? 'bg-green-100 text-green-700' : e.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                        >
                                                            {e.status === 'paid'
                                                                ? 'Pagado'
                                                                : e.status ===
                                                                    'cancelled'
                                                                  ? 'Cancelado'
                                                                  : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">
                                                        {e.expense_date
                                                            ? new Date(
                                                                  e.expense_date,
                                                              ).toLocaleDateString(
                                                                  'es-MX',
                                                              )
                                                            : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingExpense(
                                                                        e,
                                                                    );
                                                                    setShowForm(
                                                                        true,
                                                                    );
                                                                }}
                                                                className={`rounded p-1 text-gray-400 ${
                                                                    e.status ===
                                                                    'cancelled'
                                                                        ? 'cursor-not-allowed opacity-30'
                                                                        : 'hover:text-gray-600'
                                                                }`}
                                                                title={
                                                                    e.status ===
                                                                    'cancelled'
                                                                        ? 'No se puede editar'
                                                                        : 'Editar gasto'
                                                                }
                                                                disabled={
                                                                    e.status ===
                                                                    'cancelled'
                                                                }
                                                            >
                                                                <svg
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                >
                                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                    <path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>
                                                            {e.status ===
                                                            'cancelled' ? (
                                                                <button
                                                                    onClick={() =>
                                                                        router.patch(
                                                                            `/admin/events/${event.id}/expenses/${e.id}`,
                                                                            {
                                                                                status: 'pending',
                                                                            },
                                                                            {
                                                                                preserveScroll: true,
                                                                                preserveState: true,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="rounded p-1 text-green-500 hover:text-green-700"
                                                                    title="Reactivar gasto"
                                                                >
                                                                    <svg
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                    >
                                                                        <polyline points="1 4 1 10 7 10" />
                                                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                                                    </svg>
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {showForm && (
                <ExpenseFormModal
                    eventId={event.id}
                    expense={editingExpense}
                    categories={categories}
                    budget={budget}
                    totalExpenses={totalExpenses}
                    onClose={() => {
                        setShowForm(false);
                        setEditingExpense(null);
                    }}
                />
            )}
            {showBudgetForm && (
                <BudgetFormModal
                    eventId={event.id}
                    budget={budget}
                    onClose={() => setShowBudgetForm(false)}
                />
            )}
        </div>
    );
}

function ExpenseFormModal({
    eventId,
    expense,
    categories,
    budget,
    totalExpenses,
    onClose,
}: any) {
    const isEdit = !!expense;
    const formRef = React.useRef<HTMLFormElement>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState<{
        url: string;
        data: Record<string, any>;
        isEdit: boolean;
    } | null>(null);
    const [overBudgetNote, setOverBudgetNote] = useState(
        expense?.over_budget_note ?? '',
    );
    const [previewAmount, setPreviewAmount] = useState(
        expense?.amount ? String(expense.amount) : '',
    );

    const limit = Number(
        budget?.approved_amount ?? budget?.planned_amount ?? 0,
    );
    const currentTotal =
        Number(totalExpenses ?? 0) - Number(expense?.amount ?? 0);

    const newAmount = parseFloat(previewAmount) || 0;
    const previewTotal = currentTotal + newAmount;
    const overBy = limit > 0 ? previewTotal - limit : 0;
    const percentOver = limit > 0 ? (overBy / limit) * 100 : 0;
    const isOverBudget = overBy > 0 && limit > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) {
            return;
        }

        const fd = new FormData(formRef.current);
        const data: Record<string, any> = {};

        for (const [key, value] of fd.entries()) {
            data[key] = value;
        }

        const url = isEdit
            ? `/admin/events/${eventId}/expenses/${expense.id}`
            : `/admin/events/${eventId}/expenses`;

        // Check if over budget
        const submitAmount = parseFloat(data.amount) || 0;
        const submitTotal = currentTotal + submitAmount;
        const submitOverBy = submitTotal - limit;

        if (submitOverBy > 0 && limit > 0) {
            setPendingSubmit({ url, data, isEdit });
            setShowConfirm(true);

            return;
        }

        doSubmit(url, data, isEdit);
    };

    const doSubmit = (
        url: string,
        data: Record<string, any>,
        edit: boolean,
    ) => {
        const finalData = { ...data, over_budget_note: overBudgetNote };

        if (edit) {
            router.patch(url, finalData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            router.post(url, finalData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        }

        setShowConfirm(false);
        setPendingSubmit(null);
    };

    const handleConfirm = () => {
        if (!pendingSubmit) {
            return;
        }

        doSubmit(pendingSubmit.url, pendingSubmit.data, pendingSubmit.isEdit);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="mx-4 w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                        <h2 className="text-sm font-semibold">
                            {isEdit ? 'Editar gasto' : 'Nuevo gasto'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded p-1 text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Budget threshold indicator */}
                    {limit > 0 && (
                        <div className="border-b border-gray-100 bg-gray-50 px-5 py-2 dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">
                                    Presupuesto:{' '}
                                    <span className="font-mono font-medium text-foreground">
                                        ${limit.toLocaleString('es-MX')}
                                    </span>
                                </span>
                                <span className="text-gray-400">
                                    Actual:{' '}
                                    <span
                                        className={`font-mono font-medium ${currentTotal > limit ? 'text-red-600' : 'text-foreground'}`}
                                    >
                                        ${currentTotal.toLocaleString('es-MX')}
                                    </span>
                                </span>
                            </div>
                            {isOverBudget && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                                    ⚠️ Este gasto excede el presupuesto en $
                                    {overBy.toLocaleString('es-MX')} (
                                    {percentOver.toFixed(0)}%)
                                </p>
                            )}
                        </div>
                    )}

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="space-y-4 p-5"
                    >
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Categoría
                            </label>
                            <select
                                name="budget_category_id"
                                defaultValue={expense?.budget_category_id ?? ''}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                            >
                                <option value="">Sin categoría</option>
                                {categories?.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Concepto *
                            </label>
                            <input
                                name="concept"
                                defaultValue={expense?.concept ?? ''}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Descripción
                            </label>
                            <input
                                name="description"
                                defaultValue={expense?.description ?? ''}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Monto *
                                </label>
                                <input
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={previewAmount}
                                    onChange={(e) =>
                                        setPreviewAmount(e.target.value)
                                    }
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Estado
                                </label>
                                <select
                                    name="status"
                                    defaultValue={expense?.status ?? 'pending'}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="paid">Pagado</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Fecha
                                </label>
                                <input
                                    name="expense_date"
                                    type="date"
                                    defaultValue={
                                        expense?.expense_date?.slice(0, 10) ??
                                        ''
                                    }
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Proveedor
                                </label>
                                <input
                                    name="vendor_name"
                                    defaultValue={expense?.vendor_name ?? ''}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                                />
                            </div>
                        </div>
                        <input type="hidden" name="event_id" value={eventId} />
                        <input
                            type="hidden"
                            name="over_budget_note"
                            value={overBudgetNote}
                        />
                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38]"
                            >
                                {isEdit ? 'Actualizar' : 'Agregar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirm}
                onOpenChange={(open) => {
                    if (!open) setShowConfirm(false);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">
                            ⚠️ Gasto excede el presupuesto
                        </DialogTitle>
                        <DialogDescription>
                            <div className="space-y-4 pt-2">
                                <div className="rounded-lg bg-destructive/10 p-4">
                                    <p className="text-sm text-destructive">
                                        El total de gastos (
                                        <strong>
                                            $
                                            {previewTotal.toLocaleString(
                                                'es-MX',
                                            )}
                                        </strong>
                                        ) supera el presupuesto{' '}
                                        {budget?.approved_amount
                                            ? 'aprobado'
                                            : 'planeado'}{' '}
                                        de{' '}
                                        <strong>
                                            ${limit.toLocaleString('es-MX')}
                                        </strong>
                                        .
                                    </p>
                                    <p className="mt-2 text-sm text-destructive/80">
                                        Excedente:{' '}
                                        <strong>
                                            ${overBy.toLocaleString('es-MX')}
                                        </strong>{' '}
                                        ({percentOver.toFixed(1)}%)
                                    </p>
                                </div>

                                {percentOver > 20 && (
                                    <div className="grid gap-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Justificación del excedente *
                                        </label>
                                        <textarea
                                            value={overBudgetNote}
                                            onChange={(e) =>
                                                setOverBudgetNote(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Explica por qué es necesario este gasto adicional..."
                                            rows={3}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                )}

                                <div className="bg-warning/10 rounded-lg p-3">
                                    <p className="text-warning text-xs">
                                        {percentOver > 20
                                            ? 'Este gasto excede el 20% del presupuesto. Se requiere justificación.'
                                            : '¿Estás seguro de continuar con este gasto?'}
                                    </p>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setShowConfirm(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={
                                percentOver > 20 && !overBudgetNote.trim()
                            }
                        >
                            {percentOver > 20
                                ? 'Confirmar con justificación'
                                : 'Confirmar gasto'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function BudgetFormModal({ eventId, budget, onClose }: any) {
    const isEdit = !!budget;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <h2 className="text-sm font-semibold">
                        {isEdit ? 'Editar presupuesto' : 'Crear presupuesto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <form
                    className="space-y-4 p-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const d: Record<string, any> = {};

                        for (const [key, value] of fd.entries()) {
                            d[key] = value;
                        }

                        if (isEdit) {
                            router.patch(
                                `/admin/events/${eventId}/budgets/${budget.id}`,
                                d,
                                {
                                    preserveScroll: true,
                                    onSuccess: onClose,
                                },
                            );
                        } else {
                            router.post(`/admin/events/${eventId}/budgets`, d, {
                                preserveScroll: true,
                                onSuccess: onClose,
                            });
                        }
                    }}
                >
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Monto planeado *
                        </label>
                        <input
                            name="planned_amount"
                            type="number"
                            step="0.01"
                            defaultValue={budget?.planned_amount ?? ''}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                    {isEdit && (
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Monto aprobado
                            </label>
                            <input
                                name="approved_amount"
                                type="number"
                                step="0.01"
                                defaultValue={budget?.approved_amount ?? ''}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                    )}
                    {isEdit && (
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Estado
                            </label>
                            <select
                                name="status"
                                defaultValue={budget?.status ?? 'draft'}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                            >
                                <option value="draft">Borrador</option>
                                <option value="submitted">
                                    Enviado a revisión
                                </option>
                                <option value="approved">Aprobado</option>
                                <option value="rejected">Rechazado</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Notas
                        </label>
                        <textarea
                            name="notes"
                            defaultValue={budget?.notes ?? ''}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                    <input type="hidden" name="event_id" value={eventId} />
                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38]"
                        >
                            {isEdit ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
