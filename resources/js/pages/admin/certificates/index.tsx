import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

export default function CertificatesIndex({ certificates }: any) {
    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'folio',
                label: 'Folio',
                sortable: true,
                render: (c) => (
                    <Link
                        href={`/admin/certificates/${c.uuid}`}
                        className="font-mono text-xs font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                    >
                        {c.folio}
                    </Link>
                ),
            },
            {
                key: 'participant',
                label: 'Participante',
                sortable: true,
                render: (c) => (
                    <span className="text-gray-700 dark:text-gray-300">
                        {c.first_name} {c.last_name}
                    </span>
                ),
            },
            {
                key: 'event_title',
                label: 'Evento',
                sortable: true,
                render: (c) => (
                    <span className="text-xs text-gray-500">
                        {c.event_title}
                    </span>
                ),
            },
            {
                key: 'generated_at',
                label: 'Generada',
                sortable: true,
                render: (c) => (
                    <span className="text-xs text-gray-500">
                        {c.generated_at
                            ? new Date(c.generated_at).toLocaleDateString(
                                  'es-MX',
                              )
                            : 'Pendiente'}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (c) => (
                    <Link
                        href={`/admin/certificates/${c.uuid}`}
                        className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                    >
                        Ver
                    </Link>
                ),
            },
        ],
        [],
    );

    const meta = certificates?.meta;
    const totalPages = meta?.last_page ?? 1;

    return (
        <div>
            <Head title="Constancias" />
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                <span className="text-gray-600 dark:text-gray-300">
                    Constancias
                </span>
            </div>
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={certificates?.data ?? []}
                    searchPlaceholder="Buscar por folio, nombre o evento..."
                    searchKeys={[
                        'folio',
                        'first_name',
                        'last_name',
                        'event_title',
                    ]}
                    emptyMessage="No hay constancias emitidas."
                    ariaLabel="Lista de constancias"
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
