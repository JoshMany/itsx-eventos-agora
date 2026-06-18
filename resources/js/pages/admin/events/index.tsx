import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
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
}

export default function EventsIndex({ events }: any) {
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
                    <Link
                        href={`/admin/events/${e.uuid}/edit`}
                        className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                    >
                        Editar
                    </Link>
                ),
            },
        ],
        [],
    );

    const meta = events?.meta;
    const totalPages = meta?.last_page ?? 1;

    return (
        <div>
            <Head title="Eventos" />
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={events?.data ?? []}
                    searchPlaceholder="Buscar eventos..."
                    searchKeys={['title']}
                    emptyMessage="No hay eventos — crea el primero."
                    ariaLabel="Lista de eventos"
                    toolbar={
                        <Link
                            href="/admin/events/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54]"
                        >
                            <Plus size={16} />
                            Nuevo Evento
                        </Link>
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
                                    href={link.url}
                                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                    preserveState
                                    preserveScroll
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
