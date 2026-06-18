import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

export default function SurveysIndex({ surveys, showingTrashed }: any) {
    const columns: Column<any>[] = useMemo(
        () => [
            {
                key: 'title',
                label: 'Encuesta',
                sortable: true,
                render: (s: any) =>
                    showingTrashed ? (
                        <span className="font-medium text-gray-400 line-through">
                            {s.title}
                        </span>
                    ) : (
                        <Link
                            href={`/admin/surveys/${s.uuid}`}
                            className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                        >
                            {s.title}
                        </Link>
                    ),
            },
            {
                key: 'event_title',
                label: 'Evento',
                sortable: true,
                render: (s: any) => (
                    <span className="text-xs text-gray-500">
                        {s.event_title ?? '—'}
                    </span>
                ),
            },
            {
                key: 'is_required',
                label: 'Tipo',
                render: (s: any) => {
                    if (s.deleted_at) {
                        return (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400 dark:bg-gray-800">
                                Archivada
                            </span>
                        );
                    }

                    return s.is_required ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            Obligatoria
                        </span>
                    ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Opcional
                        </span>
                    );
                },
            },
            {
                key: 'created_at',
                label: showingTrashed ? 'Archivada' : 'Creada',
                sortable: true,
                render: (s: any) => (
                    <span className="text-xs text-gray-500">
                        {new Date(
                            s.deleted_at ?? s.created_at,
                        ).toLocaleDateString('es-MX')}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: '',
                className: 'text-end',
                render: (s: any) =>
                    showingTrashed ? (
                        <button
                            onClick={() =>
                                router.patch(
                                    `/admin/surveys/${s.uuid}/restore`,
                                    {},
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                        >
                            <RotateCcw size={12} />
                            Restaurar
                        </button>
                    ) : (
                        <div className="flex items-center justify-end gap-1">
                            <Link
                                href={`/admin/surveys/${s.uuid}/edit`}
                                className="rounded p-1 text-xs text-gray-400 hover:text-gray-600"
                            >
                                Editar
                            </Link>
                            <ArchiveButton uuid={s.uuid} />
                        </div>
                    ),
            },
        ],
        [showingTrashed],
    );

    return (
        <div>
            <Head title="Encuestas" />
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/surveys/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54]"
                    >
                        <Plus size={16} />
                        Nueva Encuesta
                    </Link>
                    <div className="flex-1" />
                    <Link
                        href={`/admin/surveys?trashed=${showingTrashed ? '0' : '1'}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                    >
                        <Archive size={16} />
                        {showingTrashed ? 'Encuestas activas' : 'Archivadas'}
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={surveys?.data ?? []}
                    searchPlaceholder="Buscar encuestas..."
                    searchKeys={['title']}
                    emptyMessage={
                        showingTrashed
                            ? 'No hay encuestas archivadas.'
                            : 'No hay encuestas — crea la primera.'
                    }
                    ariaLabel="Lista de encuestas"
                />
            </div>
        </div>
    );
}

function ArchiveButton({ uuid }: { uuid: string }) {
    const [confirm, setConfirm] = useState(false);
    const { delete: destroy, processing } = useForm();

    if (confirm) {
        return (
            <span className="inline-flex items-center gap-1 text-xs">
                <span className="text-gray-400">Archivar?</span>
                <button
                    onClick={() =>
                        destroy(`/admin/surveys/${uuid}`, {
                            preserveState: true,
                            preserveScroll: true,
                        })
                    }
                    disabled={processing}
                    className="font-medium text-red-500 hover:text-red-700"
                >
                    Sí
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
            title="Archivar encuesta"
        >
            <Trash2 size={14} />
        </button>
    );
}
