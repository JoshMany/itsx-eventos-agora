import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

const typeLabels: Record<string, string> = {
    student: 'Estudiante',
    staff: 'Personal',
    external: 'Externo',
};
const typeColors: Record<string, string> = {
    student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    staff: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    external: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function ParticipantsIndex({ participants }: any) {
    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'name',
                label: 'Participante',
                sortable: true,
                render: (p) => (
                    <span className="flex flex-col">
                        <Link
                            href={`/admin/participants/${p.uuid}`}
                            className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                        >
                            {p.first_name} {p.last_name}
                        </Link>
                        {p.organization_name && (
                            <span className="text-xs text-gray-400">
                                {p.organization_name}
                            </span>
                        )}
                    </span>
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
                render: (p) => (
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[p.type] ?? ''}`}
                    >
                        {typeLabels[p.type] ?? p.type}
                    </span>
                ),
            },
            {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (p) => <span className="text-gray-500">{p.email}</span>,
            },
            {
                key: 'phone',
                label: 'Teléfono',
                sortable: true,
                render: (p) => (
                    <span className="text-gray-500">{p.phone ?? '—'}</span>
                ),
            },
            {
                key: 'created_at',
                label: 'Registrado',
                sortable: true,
                render: (p) => (
                    <span className="text-xs text-gray-500">
                        {p.created_at
                            ? new Date(p.created_at).toLocaleDateString('es-MX')
                            : '—'}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (p) => (
                    <Link
                        href={`/admin/participants/${p.uuid}`}
                        className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                    >
                        Ver
                    </Link>
                ),
            },
        ],
        [],
    );

    const meta = participants?.meta;
    const totalPages = meta?.last_page ?? 1;

    return (
        <div>
            <Head title="Participantes" />
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={participants?.data ?? []}
                    searchPlaceholder="Buscar por nombre o email..."
                    searchKeys={['first_name', 'last_name', 'email']}
                    emptyMessage="No hay participantes registrados."
                    ariaLabel="Lista de participantes"
                    toolbar={
                        <Link
                            href="/admin/participants/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54]"
                        >
                            <Plus size={16} />
                            Nuevo Participante
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
