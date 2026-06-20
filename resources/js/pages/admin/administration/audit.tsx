import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Search,
    X,
    Filter,
    Clock,
    User,
    Box,
    Activity,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from 'lucide-react';
import { useState } from 'react';

type ActivityItem = {
    id: number;
    description: string;
    subject_type: string | null;
    subject_label: string | null;
    subject_id: number | null;
    event: string;
    event_label: string;
    causer: { id: number; name: string; email: string } | null;
    properties: Record<string, any>;
    attribute_changes: Record<string, any> | null;
    created_at: string;
    created_at_human: string;
};

type FilterOption = {
    value: string;
    label: string;
};

export default function AdministrationAudit({
    activities,
    filters,
    activeFilters,
}: {
    activities: {
        data: ActivityItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        users: FilterOption[];
        modelTypes: FilterOption[];
        events: FilterOption[];
        eventList: FilterOption[];
    };
    activeFilters: Record<string, string>;
}) {
    const [showFilters, setShowFilters] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (id: number) => {
        const next = new Set(expandedRows);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setExpandedRows(next);
    };

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page');
        router.get(
            `/admin/administration/audit?${params.toString()}`,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearAllFilters = () => {
        router.get(
            '/admin/administration/audit',
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const removeFilter = (key: string) => {
        applyFilter(key, '');
    };

    const hasActiveFilters = Object.values(activeFilters).some((v) => v);

    const filterLabel = (key: string, value: string): string => {
        switch (key) {
            case 'causer_id': {
                const u = filters.users.find((f) => String(f.value) === value);
                return u ? `Usuario: ${u.label}` : `Usuario: ${value}`;
            }
            case 'subject_type': {
                const m = filters.modelTypes.find((f) => f.value === value);
                return m ? `Módulo: ${m.label}` : `Módulo: ${value}`;
            }
            case 'event': {
                const e = filters.events.find((f) => f.value === value);
                return e ? `Acción: ${e.label}` : `Acción: ${value}`;
            }
            case 'date_from':
                return `Desde: ${value}`;
            case 'date_to':
                return `Hasta: ${value}`;
            case 'search':
                return `Búsqueda: "${value}"`;
            case 'event_filter': {
                const ev = filters.eventList.find(
                    (f) => String(f.value) === value,
                );
                return ev ? `Evento: ${ev.label}` : `Evento: ${value}`;
            }
            default:
                return `${key}: ${value}`;
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const actionBadgeClass = (event: string) => {
        switch (event) {
            case 'created':
                return 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400';
            case 'updated':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400';
            case 'deleted':
                return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400';
            case 'restored':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400';
            default:
                return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const renderProperties = (properties: Record<string, any>) => {
        const old = properties?.old ?? {};
        const attrs = properties?.attributes ?? {};

        if (!Object.keys(old).length && !Object.keys(attrs).length) {
            return (
                <p className="text-xs text-gray-400">
                    Sin detalles adicionales.
                </p>
            );
        }

        const allKeys = new Set([...Object.keys(old), ...Object.keys(attrs)]);

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-3 py-1.5 text-left font-medium text-gray-400">
                                Campo
                            </th>
                            <th className="px-3 py-1.5 text-left font-medium text-gray-400">
                                Anterior
                            </th>
                            <th className="px-3 py-1.5 text-left font-medium text-gray-400">
                                Nuevo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {Array.from(allKeys).map((key) => (
                            <tr key={key}>
                                <td className="px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300">
                                    {key}
                                </td>
                                <td className="px-3 py-1.5 text-gray-400">
                                    {formatValue(old[key])}
                                </td>
                                <td className="px-3 py-1.5 text-gray-600 dark:text-gray-300">
                                    {formatValue(attrs[key])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const formatValue = (val: any): string => {
        if (val === null || val === undefined) return '—';
        if (typeof val === 'boolean') return val ? 'Sí' : 'No';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    return (
        <div>
            <Head title="Auditoría" />

            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link
                    href="/admin/administration"
                    className="hover:text-gray-600"
                >
                    Administración
                </Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">
                    Auditoría
                </span>
            </div>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Auditoría</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Registro de actividad del sistema.{' '}
                            {activities.total > 0 && (
                                <span className="text-gray-400">
                                    {activities.total} registros encontrados
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <Filter size={14} />
                        Filtros
                        {hasActiveFilters && (
                            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#001e38] text-[10px] text-white dark:bg-[#dcc355] dark:text-[#001e38]">
                                {
                                    Object.values(activeFilters).filter(Boolean)
                                        .length
                                }
                            </span>
                        )}
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* User filter */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Usuario
                                </label>
                                <select
                                    value={activeFilters.causer_id ?? ''}
                                    onChange={(e) =>
                                        applyFilter('causer_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">Todos</option>
                                    {filters.users.map((u) => (
                                        <option key={u.value} value={u.value}>
                                            {u.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Module filter */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Módulo
                                </label>
                                <select
                                    value={activeFilters.subject_type ?? ''}
                                    onChange={(e) =>
                                        applyFilter(
                                            'subject_type',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">Todos</option>
                                    {filters.modelTypes.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action filter */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Acción
                                </label>
                                <select
                                    value={activeFilters.event ?? ''}
                                    onChange={(e) =>
                                        applyFilter('event', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">Todas</option>
                                    {filters.events.map((e) => (
                                        <option key={e.value} value={e.value}>
                                            {e.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Event filter */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Evento
                                </label>
                                <select
                                    value={activeFilters.event_filter ?? ''}
                                    onChange={(e) =>
                                        applyFilter(
                                            'event_filter',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="">Todos</option>
                                    {filters.eventList.map((e) => (
                                        <option key={e.value} value={e.value}>
                                            {e.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date from */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={activeFilters.date_from ?? ''}
                                    onChange={(e) =>
                                        applyFilter('date_from', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                />
                            </div>

                            {/* Date to */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={activeFilters.date_to ?? ''}
                                    onChange={(e) =>
                                        applyFilter('date_to', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-600 dark:bg-gray-800"
                                />
                            </div>

                            {/* Search */}
                            <div>
                                <label className="mb-1 block text-[11px] font-medium uppercase text-gray-400">
                                    Búsqueda
                                </label>
                                <div className="relative">
                                    <Search
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar en descripción..."
                                        defaultValue={
                                            activeFilters.search ?? ''
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                applyFilter(
                                                    'search',
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value,
                                                );
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs dark:border-gray-600 dark:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Clear button */}
                            <div className="flex items-end">
                                <button
                                    onClick={clearAllFilters}
                                    disabled={!hasActiveFilters}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:border-gray-700"
                                >
                                    <RotateCcw size={12} />
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(activeFilters).map(([key, value]) =>
                            value ? (
                                <span
                                    key={key}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#001e38]/10 px-3 py-1 text-xs font-medium text-[#001e38] dark:bg-[#dcc355]/10 dark:text-[#dcc355]"
                                >
                                    {filterLabel(key, value)}
                                    <button
                                        onClick={() => removeFilter(key)}
                                        className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                                    >
                                        <X size={10} />
                                    </button>
                                </span>
                            ) : null,
                        )}
                    </div>
                )}

                {/* Activity table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase text-gray-400">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={12} />
                                            Fecha
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase text-gray-400">
                                        <span className="inline-flex items-center gap-1">
                                            <User size={12} />
                                            Usuario
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase text-gray-400">
                                        <span className="inline-flex items-center gap-1">
                                            <Box size={12} />
                                            Módulo
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase text-gray-400">
                                        <span className="inline-flex items-center gap-1">
                                            <Activity size={12} />
                                            Acción
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase text-gray-400">
                                        Descripción
                                    </th>
                                    <th className="w-10 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {activities.data.map((item) => (
                                    <>
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <td className="px-4 py-2.5 text-xs text-gray-500">
                                                <div>
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    {item.created_at_human}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-xs">
                                                {item.causer ? (
                                                    <div>
                                                        <div className="font-medium text-gray-700 dark:text-gray-300">
                                                            {item.causer.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">
                                                            {item.causer.email}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Sistema
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
                                                {item.subject_label ?? '—'}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${actionBadgeClass(
                                                        item.event,
                                                    )}`}
                                                >
                                                    {item.event_label}
                                                </span>
                                            </td>
                                            <td className="max-w-xs px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
                                                <div className="truncate">
                                                    {item.description}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <button
                                                    onClick={() =>
                                                        toggleRow(item.id)
                                                    }
                                                    className="rounded p-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    {expandedRows.has(
                                                        item.id,
                                                    ) ? (
                                                        <ChevronUp size={14} />
                                                    ) : (
                                                        <ChevronDown
                                                            size={14}
                                                        />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRows.has(item.id) && (
                                            <tr
                                                key={`${item.id}-details`}
                                                className="bg-gray-50 dark:bg-gray-800/30"
                                            >
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-3"
                                                >
                                                    <div className="mb-2 text-[11px] font-medium uppercase text-gray-400">
                                                        Detalles del cambio
                                                    </div>
                                                    {renderProperties(
                                                        item.attribute_changes ??
                                                            item.properties,
                                                    )}
                                                    {item.subject_type &&
                                                        item.subject_id && (
                                                            <div className="mt-2 text-[10px] text-gray-400">
                                                                ID:{' '}
                                                                {
                                                                    item.subject_id
                                                                }
                                                            </div>
                                                        )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {!activities.data.length && (
                        <div className="px-4 py-16 text-center">
                            <Activity
                                size={40}
                                className="mx-auto text-gray-300 dark:text-gray-600"
                            />
                            <p className="mt-3 text-sm font-medium text-gray-500">
                                Sin registros de actividad
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                {hasActiveFilters
                                    ? 'No hay resultados con los filtros aplicados. Intenta ajustarlos.'
                                    : 'La actividad del sistema aparecerá aquí cuando se realicen operaciones.'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {activities.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
                            <p className="text-xs text-gray-400">
                                Mostrando {activities.from}–{activities.to} de{' '}
                                {activities.total}
                            </p>
                            <div className="flex items-center gap-1">
                                {activities.links
                                    .filter(
                                        (l) =>
                                            !l.label.includes('Previous') &&
                                            !l.label.includes('Next'),
                                    )
                                    .map((link) => (
                                        <button
                                            key={link.label}
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(
                                                        link.url,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[#001e38] text-white dark:bg-[#dcc355] dark:text-[#001e38]'
                                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            } disabled:opacity-30`}
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
