import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    submitted: 'En revisión',
    approved: 'Aprobado',
    rejected: 'Rechazado',
};
const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    submitted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function BudgetsIndex({ budgets }: any) {
    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'event',
                label: 'Evento',
                sortable: true,
                render: (b) => (
                    <span className="text-foreground font-medium">
                        {b.event?.title ?? '—'}
                    </span>
                ),
            },
            {
                key: 'planned_amount',
                label: 'Planeado',
                sortable: true,
                render: (b) => (
                    <span className="font-mono text-xs">
                        ${parseFloat(b.planned_amount).toLocaleString('es-MX')}
                    </span>
                ),
            },
            {
                key: 'approved_amount',
                label: 'Aprobado',
                sortable: true,
                render: (b) => (
                    <span className="font-mono text-xs text-green-600">
                        {b.approved_amount
                            ? `$${parseFloat(b.approved_amount).toLocaleString('es-MX')}`
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
                render: (b) => (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[b.status] ?? ''}`}
                    >
                        {statusLabels[b.status] ?? b.status}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (b) =>
                    b.event?.uuid ? (
                        <Link
                            href={`/admin/events/${b.event.uuid}?tab=presupuestos`}
                            className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                        >
                            Ver
                        </Link>
                    ) : (
                        <span className="text-xs text-gray-300">—</span>
                    ),
            },
        ],
        [],
    );

    const meta = budgets?.meta;
    const totalPages = meta?.last_page ?? 1;

    return (
        <div>
            <Head title="Presupuestos" />
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={budgets?.data ?? []}
                    searchPlaceholder="Buscar por evento..."
                    searchKeys={[]}
                    emptyMessage="No hay presupuestos registrados."
                    ariaLabel="Lista de presupuestos"
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
