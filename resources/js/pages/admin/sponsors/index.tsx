import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

const typeLabels: Record<string, string> = {
    financial: 'Financiero',
    in_kind: 'En especie',
    media: 'Medios',
    academic: 'Académico',
    venue: 'Sede',
};
const statusLabels: Record<string, string> = {
    prospective: 'Prospecto',
    confirmed: 'Confirmado',
    active: 'Activo',
    completed: 'Completado',
    cancelled: 'Cancelado',
};
const statusColors: Record<string, string> = {
    prospective: 'bg-gray-100 text-gray-600',
    confirmed: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function SponsorsIndex({ sponsors }: any) {
    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'name',
                label: 'Patrocinador',
                sortable: true,
                render: (s) => (
                    <span className="text-foreground font-medium">
                        {s.name}
                    </span>
                ),
            },
            {
                key: 'event',
                label: 'Evento',
                sortable: true,
                render: (s) => (
                    <span className="text-xs text-gray-500">
                        {s.event?.title ?? '—'}
                    </span>
                ),
            },
            {
                key: 'sponsorship_type',
                label: 'Tipo',
                sortable: true,
                filterable: true,
                filterOptions: Object.entries(typeLabels).map(([k, v]) => ({
                    label: v,
                    value: k,
                })),
                render: (s) => (
                    <span className="text-xs text-gray-500">
                        {typeLabels[s.sponsorship_type] ?? s.sponsorship_type}
                    </span>
                ),
            },
            {
                key: 'contribution_value',
                label: 'Aporte',
                sortable: true,
                render: (s) => (
                    <span className="font-mono text-xs text-green-600">
                        {s.contribution_value > 0
                            ? `$${parseFloat(s.contribution_value).toLocaleString('es-MX')}`
                            : '—'}
                    </span>
                ),
            },
            {
                key: 'status',
                label: 'Estado',
                sortable: true,
                filterable: true,
                filterOptions: Object.entries(statusLabels).map(([k, v]) => ({
                    label: v,
                    value: k,
                })),
                render: (s) => (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[s.status] ?? ''}`}
                    >
                        {statusLabels[s.status] ?? s.status}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (s) =>
                    s.event?.uuid ? (
                        <Link
                            href={`/admin/events/${s.event.uuid}?tab=patrocinadores`}
                            className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                        >
                            Ver evento
                        </Link>
                    ) : (
                        <span className="text-xs text-gray-300">—</span>
                    ),
            },
        ],
        [],
    );

    const meta = sponsors?.meta;
    const totalPages = meta?.last_page ?? 1;

    return (
        <div>
            <Head title="Patrocinadores" />
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                <span className="text-gray-600 dark:text-gray-300">
                    Patrocinadores
                </span>
            </div>
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={sponsors?.data ?? []}
                    searchPlaceholder="Buscar patrocinador..."
                    searchKeys={['name']}
                    emptyMessage="No hay patrocinadores registrados."
                    ariaLabel="Lista de patrocinadores"
                />

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

                            if (!link.url || isActive) {
                                return (
                                    <span
                                        key={i}
                                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium ${
                                            isActive
                                                ? 'bg-[#001e38] text-white dark:bg-[#dcc355] dark:text-[#001e38]'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
