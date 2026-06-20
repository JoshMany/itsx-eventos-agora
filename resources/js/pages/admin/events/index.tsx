import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus,
    Archive,
    Trash2,
    ArchiveRestore,
    AlertTriangle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    pending_review:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    published:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    finished:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    pending_review: 'Pendiente',
    approved: 'Aprobado',
    published: 'Publicado',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
};

interface EventRow {
    uuid: string;
    title: string;
    starts_at: string | null;
    status: string;
    capacity: number | null;
    archived_at: string | null;
    deleted_at?: string | null;
}

type ConfirmAction = { uuid: string; action: string; title: string } | null;

export default function EventsIndex({ events, archived }: any) {
    const [confirming, setConfirming] = useState<ConfirmAction>(null);
    const { flash } = usePage().props as any;

    const handleAction = (uuid: string, action: string) => {
        switch (action) {
            case 'archive':
                router.patch(
                    `/admin/events/${uuid}/archive`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => setConfirming(null),
                    },
                );
                break;
            case 'unarchive':
                router.patch(
                    `/admin/events/${uuid}/unarchive`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => setConfirming(null),
                    },
                );
                break;
            case 'trash':
                router.delete(`/admin/events/${uuid}`, {
                    preserveScroll: true,
                    onSuccess: () => setConfirming(null),
                });
                break;
            case 'restore':
                router.patch(
                    `/admin/events/${uuid}/restore`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => setConfirming(null),
                    },
                );
                break;
            case 'force-delete':
                router.delete(`/admin/events/${uuid}/force`, {
                    preserveScroll: true,
                    onSuccess: () => setConfirming(null),
                });
                break;
        }
    };

    const canForceDelete = (status: string) =>
        !['published', 'approved', 'finished'].includes(status);

    const columns: Column<EventRow>[] = useMemo(
        () => [
            {
                key: 'title',
                label: 'Evento',
                sortable: true,
                render: (e) => (
                    <Link
                        href={`/admin/events/${e.uuid}`}
                        className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                    >
                        {e.title}
                    </Link>
                ),
            },
            {
                key: 'starts_at',
                label: 'Fecha',
                sortable: true,
                render: (e) => (
                    <span className="text-gray-500">
                        {e.starts_at
                            ? new Date(e.starts_at).toLocaleDateString('es-MX')
                            : '—'}
                    </span>
                ),
            },
            {
                key: 'status',
                label: 'Estado',
                sortable: true,
                filterable: true,
                filterOptions: [
                    { label: 'Borrador', value: 'draft' },
                    { label: 'Pendiente', value: 'pending_review' },
                    { label: 'Aprobado', value: 'approved' },
                    { label: 'Publicado', value: 'published' },
                    { label: 'Finalizado', value: 'finished' },
                    { label: 'Cancelado', value: 'cancelled' },
                ],
                render: (e) => (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[e.status] ?? ''}`}
                    >
                        {statusLabels[e.status] ?? e.status}
                    </span>
                ),
            },
            {
                key: 'capacity',
                label: 'Capacidad',
                sortable: true,
                render: (e) => (
                    <span className="text-gray-500">{e.capacity ?? '—'}</span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (e) => (
                    <div className="flex items-center justify-end gap-0.5">
                        <Link
                            href={`/admin/events/${e.uuid}/edit`}
                            className="rounded px-2 py-1 text-[11px] text-gray-400 hover:text-gray-600"
                        >
                            Editar
                        </Link>

                        {/* Archive / Unarchive */}
                        {!archived && (
                            <button
                                onClick={() =>
                                    setConfirming({
                                        uuid: e.uuid,
                                        action: 'archive',
                                        title: e.title,
                                    })
                                }
                                className="rounded px-2 py-1 text-[11px] text-gray-400 hover:text-amber-600"
                                title="Archivar"
                            >
                                <Archive size={13} />
                            </button>
                        )}
                        {archived && (
                            <button
                                onClick={() =>
                                    setConfirming({
                                        uuid: e.uuid,
                                        action: 'unarchive',
                                        title: e.title,
                                    })
                                }
                                className="rounded px-2 py-1 text-[11px] text-gray-400 hover:text-green-600"
                                title="Desarchivar"
                            >
                                <ArchiveRestore size={13} />
                            </button>
                        )}

                        {/* Trash / Restore */}
                        {!archived && (
                            <button
                                onClick={() =>
                                    setConfirming({
                                        uuid: e.uuid,
                                        action: 'trash',
                                        title: e.title,
                                    })
                                }
                                className="rounded px-2 py-1 text-[11px] text-gray-400 hover:text-red-500"
                                title="Enviar a papelera"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}

                        {/* Permanent delete: solo para draft/pending_review */}
                        {!archived && canForceDelete(e.status) && (
                            <button
                                onClick={() =>
                                    setConfirming({
                                        uuid: e.uuid,
                                        action: 'force-delete',
                                        title: e.title,
                                    })
                                }
                                className="rounded px-2 py-1 text-[11px] text-gray-300 hover:text-red-600"
                                title="Eliminar permanentemente"
                            >
                                <AlertTriangle size={13} />
                            </button>
                        )}
                    </div>
                ),
            },
        ],
        [archived],
    );

    const meta = events?.meta;
    const totalPages = meta?.last_page ?? 1;

    const confirmMessages: Record<
        string,
        { title: string; description: string; button: string; color: string }
    > = {
        archive: {
            title: 'Archivar evento',
            description:
                'El evento se moverá a la sección de archivados. No se eliminará ningún dato.',
            button: 'Archivar',
            color: 'bg-amber-500 hover:bg-amber-600',
        },
        unarchive: {
            title: 'Desarchivar evento',
            description:
                'El evento volverá a la lista principal de eventos activos.',
            button: 'Desarchivar',
            color: 'bg-green-500 hover:bg-green-600',
        },
        trash: {
            title: 'Enviar a papelera',
            description:
                'El evento se moverá a la papelera. Podrás restaurarlo después si es necesario.',
            button: 'Enviar a papelera',
            color: 'bg-red-500 hover:bg-red-600',
        },
        restore: {
            title: 'Restaurar evento',
            description: 'El evento se restaurará desde la papelera.',
            button: 'Restaurar',
            color: 'bg-green-500 hover:bg-green-600',
        },
        'force-delete': {
            title: 'Eliminar permanentemente',
            description:
                'Esta acción NO se puede deshacer. Se eliminará el evento y TODOS sus datos relacionados (actividades, registros, presupuestos, etc.). Solo es posible porque este evento nunca fue publicado.',
            button: 'Eliminar para siempre',
            color: 'bg-red-600 hover:bg-red-700',
        },
    };

    return (
        <div>
            <Head title="Eventos" />

            {/* Flash messages */}
            {flash?.error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                    {flash.error}
                </div>
            )}
            {flash?.success && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400">
                    {flash.success}
                </div>
            )}

            <div className="space-y-4">
                {/* Archive/Active Tabs */}
                <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800">
                    <Link
                        href="/admin/events"
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                            !archived
                                ? 'border-b-2 border-[#001e38] text-[#001e38] dark:border-[#dcc355] dark:text-[#dcc355]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Activos
                    </Link>
                    <Link
                        href="/admin/events?archived=1"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                            archived
                                ? 'border-b-2 border-[#001e38] text-[#001e38] dark:border-[#dcc355] dark:text-[#dcc355]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Archive size={14} />
                        Archivados
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={events?.data ?? []}
                    searchPlaceholder="Buscar eventos..."
                    searchKeys={['title']}
                    emptyMessage={
                        archived
                            ? 'No hay eventos archivados.'
                            : 'No hay eventos — crea el primero.'
                    }
                    ariaLabel="Lista de eventos"
                    toolbar={
                        !archived && (
                            <Link
                                href="/admin/events/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54]"
                            >
                                <Plus size={16} />
                                Nuevo Evento
                            </Link>
                        )
                    }
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {meta.links.map((link: any, i: number) => {
                            const isActive = link.active;
                            const label =
                                link.label === '&laquo; Anterior'
                                    ? 'Anterior'
                                    : link.label === '&raquo; Siguiente'
                                      ? 'Siguiente'
                                      : link.label;

                            if (isActive) {
                                return (
                                    <span
                                        key={i}
                                        className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#001e38] px-2 text-xs font-medium text-white dark:bg-[#dcc355] dark:text-[#001e38]"
                                    >
                                        {label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                        !link.url
                                            ? 'pointer-events-none opacity-30'
                                            : ''
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="text-lg font-semibold">
                            {confirmMessages[confirming.action]?.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {confirmMessages[confirming.action]?.description}
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            &ldquo;{confirming.title}&rdquo;
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setConfirming(null)}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() =>
                                    handleAction(
                                        confirming.uuid,
                                        confirming.action,
                                    )
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${confirmMessages[confirming.action]?.color}`}
                            >
                                {confirmMessages[confirming.action]?.button}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
