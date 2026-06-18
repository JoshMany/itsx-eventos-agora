import { Table } from '@heroui/react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export type SortDirection = 'ascending' | 'descending';

export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    filterOptions?: { label: string; value: string }[];
    render: (item: T) => React.ReactNode;
    className?: string;
    cellClassName?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    emptyMessage?: string;
    ariaLabel?: string;
    toolbar?: React.ReactNode;
    onRowAction?: (key: React.Key) => void;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    searchable = true,
    searchPlaceholder = 'Buscar...',
    searchKeys,
    emptyMessage = 'Sin datos',
    ariaLabel = 'Tabla de datos',
    toolbar,
    onRowAction,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: SortDirection;
    }>({ column: '', direction: 'ascending' });

    const [filters, setFilters] = useState<Record<string, string>>({});

    // Filter by search
    const searched = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        const keys = searchKeys ?? (data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : []);
        return data.filter((item) =>
            keys.some((key) => {
                const val = item[key];
                return val != null && String(val).toLowerCase().includes(q);
            }),
        );
    }, [data, search, searchKeys]);

    // Filter by column filters
    const filtered = useMemo(() => {
        let result = searched;
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;
            result = result.filter((item) => {
                const val = item[key];
                return val != null && String(val).toLowerCase() === value.toLowerCase();
            });
        });
        return result;
    }, [searched, filters]);

    // Sort
    const sorted = useMemo(() => {
        const { column, direction } = sortDescriptor;
        if (!column) return filtered;
        return [...filtered].sort((a, b) => {
            const first = String(a[column] ?? '');
            const second = String(b[column] ?? '');
            let cmp = first.localeCompare(second, 'es', { numeric: true });
            if (direction === 'descending') cmp *= -1;
            return cmp;
        });
    }, [filtered, sortDescriptor]);

    const activeFilters = Object.entries(filters).filter(([, v]) => v);

    return (
        <div className="space-y-3">
            {/* Toolbar: search + filters + custom toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {searchable && (
                    <div className="relative min-w-60 flex-1">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm outline-none placeholder:text-gray-400 focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}

                {/* Column filter dropdowns */}
                {columns
                    .filter((c) => c.filterable && c.filterOptions)
                    .map((col) => (
                        <select
                            key={col.key}
                            value={filters[col.key] ?? ''}
                            onChange={(e) =>
                                setFilters((prev) => {
                                    const next = { ...prev };
                                    if (e.target.value) {
                                        next[col.key] = e.target.value;
                                    } else {
                                        delete next[col.key];
                                    }
                                    return next;
                                })
                            }
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">{col.label}</option>
                            {col.filterOptions?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ))}

                {toolbar}
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {activeFilters.map(([key, value]) => {
                        const col = columns.find((c) => c.key === key);
                        const opt = col?.filterOptions?.find((o) => o.value === value);
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#001e38]/10 px-3 py-1 text-xs font-medium text-[#001e38] dark:bg-[#dcc355]/20 dark:text-[#dcc355]"
                            >
                                {col?.label}: {opt?.label ?? value}
                                <button
                                    onClick={() =>
                                        setFilters((prev) => {
                                            const next = { ...prev };
                                            delete next[key];
                                            return next;
                                        })
                                    }
                                    className="rounded p-0.5 hover:bg-black/10"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        );
                    })}
                    <button
                        onClick={() => setFilters({})}
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* Table */}
            <Table>
                <Table.ScrollContainer>
                    <Table.Content
                        aria-label={ariaLabel}
                        className="min-w-150"
                        sortDescriptor={
                            sortDescriptor.column
                                ? {
                                      column: sortDescriptor.column,
                                      direction: sortDescriptor.direction,
                                  }
                                : undefined
                        }
                        onSortChange={(descriptor) => {
                            if (descriptor) {
                                setSortDescriptor({
                                    column: descriptor.column as string,
                                    direction: descriptor.direction as SortDirection,
                                });
                            }
                        }}
                    >
                        <Table.Header>
                            {columns.map((col) => (
                                <Table.Column
                                    key={col.key}
                                    id={col.key}
                                    allowsSorting={col.sortable}
                                    className={col.className}
                                >
                                    {col.sortable
                                        ? ({ sortDirection }: any) => (
                                              <span className="inline-flex items-center gap-1">
                                                  {col.label}
                                                  <ArrowUpDown size={12} className="shrink-0 text-gray-400" />
                                              </span>
                                          )
                                        : col.label}
                                </Table.Column>
                            ))}
                        </Table.Header>
                        <Table.Body>
                            {sorted.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell
                                        colSpan={columns.length}
                                        className="py-12 text-center text-sm text-gray-400"
                                    >
                                        {emptyMessage}
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                sorted.map((item, i) => {
                                    const rowKey = item.uuid ?? item.id ?? i;
                                    return (
                                        <Table.Row
                                            key={rowKey}
                                            id={rowKey}
                                            onAction={
                                                onRowAction
                                                    ? () => onRowAction(rowKey)
                                                    : undefined
                                            }
                                        >
                                            {columns.map((col) => (
                                                <Table.Cell
                                                    key={col.key}
                                                    className={col.cellClassName}
                                                >
                                                    {col.render(item)}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            {/* Footer: count */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                    {sorted.length} de {data.length} elementos
                </span>
                {search && (
                    <span>
                        {filtered.length !== sorted.length &&
                            `${filtered.length} filtrados`}
                    </span>
                )}
            </div>
        </div>
    );
}
