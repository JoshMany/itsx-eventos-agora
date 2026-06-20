import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

type CatalogItem = {
    id: number;
    name: string;
    code?: string;
    description?: string;
    capacity?: number;
    building?: string;
    address?: string;
};

const TABS = [
    { key: 'activity_types', label: 'Tipos de Actividad' },
    { key: 'rooms', label: 'Salas' },
    { key: 'tracks', label: 'Ejes Temáticos', readonly: true },
    { key: 'certificate_types', label: 'Tipos de Constancia' },
    { key: 'budget_categories', label: 'Categorías Presupuesto' },
    { key: 'venues', label: 'Sedes' },
];

function CatalogTable({
    title,
    table,
    items,
    columns,
    readonly = false,
}: {
    title: string;
    table: string;
    items: CatalogItem[];
    columns: { key: string; label: string }[];
    readonly?: boolean;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<CatalogItem | null>(null);
    const [confirming, setConfirming] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);
    const { errors } = usePage().props as any;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current || processing) return;
        setProcessing(true);
        const fd = new FormData(formRef.current);
        const data: Record<string, any> = { table };
        for (const [k, v] of fd.entries()) data[k] = v;

        if (editing) {
            data.id = editing.id;
            router.patch('/admin/administration/catalogs', data, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowForm(false);
                    setEditing(null);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        } else {
            router.post('/admin/administration/catalogs', data, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowForm(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (processing) return;
        setProcessing(true);
        router.delete('/admin/administration/catalogs', {
            data: { table, id },
            preserveScroll: true,
            onSuccess: () => {
                setConfirming(null);
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    };

    const fieldError = (field: string): string | null => {
        return (errors as Record<string, string>)?.[field] ?? null;
    };

    const inputClass = (field: string) =>
        `mt-1 block w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 ${
            fieldError(field)
                ? 'border-red-400 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
        }`;

    const extraFields = () => {
        switch (table) {
            case 'activity_types':
            case 'certificate_types':
            case 'budget_categories':
                return (
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Código
                        </label>
                        <input
                            name="code"
                            defaultValue={editing?.code ?? ''}
                            className={inputClass('code')}
                        />
                        {fieldError('code') && (
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError('code')}
                            </p>
                        )}
                    </div>
                );
            case 'rooms':
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Capacidad
                                </label>
                                <input
                                    name="capacity"
                                    type="number"
                                    defaultValue={editing?.capacity ?? ''}
                                    className={inputClass('capacity')}
                                />
                                {fieldError('capacity') && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {fieldError('capacity')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">
                                    Edificio
                                </label>
                                <input
                                    name="building"
                                    defaultValue={editing?.building ?? ''}
                                    className={inputClass('building')}
                                />
                                {fieldError('building') && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {fieldError('building')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">
                                Descripción
                            </label>
                            <input
                                name="description"
                                defaultValue={editing?.description ?? ''}
                                className={inputClass('description')}
                            />
                            {fieldError('description') && (
                                <p className="mt-1 text-xs text-red-500">
                                    {fieldError('description')}
                                </p>
                            )}
                        </div>
                    </div>
                );
            case 'venues':
                return (
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Dirección
                        </label>
                        <input
                            name="address"
                            defaultValue={editing?.address ?? ''}
                            className={inputClass('address')}
                        />
                        {fieldError('address') && (
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError('address')}
                            </p>
                        )}
                    </div>
                );
            default:
                return (
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Descripción
                        </label>
                        <input
                            name="description"
                            defaultValue={editing?.description ?? ''}
                            className={inputClass('description')}
                        />
                        {fieldError('description') && (
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError('description')}
                            </p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    {readonly && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                            <AlertTriangle size={10} />
                            Solo lectura
                        </span>
                    )}
                </div>
                {!readonly && (
                    <button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        disabled={processing}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#001e38] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                    >
                        <Plus size={14} />
                        Agregar
                    </button>
                )}
            </div>

            {readonly && (
                <p className="mb-3 text-xs text-gray-400">
                    Este catálogo está vinculado a eventos específicos y no
                    puede editarse desde aquí. Utiliza la sección de eventos
                    para gestionar sus registros.
                </p>
            )}

            {showForm && !readonly && (
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="mb-3 rounded-lg border border-[#001e38]/20 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                >
                    <div className="mb-3">
                        <label className="text-xs font-medium text-gray-500">
                            Nombre *
                        </label>
                        <input
                            name="name"
                            defaultValue={editing?.name ?? ''}
                            required
                            className={inputClass('name')}
                        />
                        {fieldError('name') && (
                            <p className="mt-1 text-xs text-red-500">
                                {fieldError('name')}
                            </p>
                        )}
                    </div>
                    {extraFields()}
                    <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditing(null);
                            }}
                            disabled={processing}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#001e38] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                        >
                            {processing && (
                                <Loader2 size={12} className="animate-spin" />
                            )}
                            {editing ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            )}

            <table className="w-full text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-800">
                    <tr>
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                className="px-3 py-2 text-left text-[11px] font-medium uppercase text-gray-400"
                            >
                                {c.label}
                            </th>
                        ))}
                        {!readonly && <th className="w-16 px-3 py-2"></th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            {columns.map((c) => (
                                <td
                                    key={c.key}
                                    className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400"
                                >
                                    {(item as any)[c.key] ?? '—'}
                                </td>
                            ))}
                            {!readonly && (
                                <td className="px-3 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => {
                                                setEditing(item);
                                                setShowForm(true);
                                            }}
                                            disabled={processing}
                                            className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        {confirming === item.id ? (
                                            <span className="inline-flex items-center gap-1 text-[10px]">
                                                <span className="text-gray-400">
                                                    Eliminar?
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    disabled={processing}
                                                    className="font-medium text-red-500 disabled:opacity-50"
                                                >
                                                    Si
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setConfirming(null)
                                                    }
                                                    disabled={processing}
                                                    className="text-gray-400 disabled:opacity-50"
                                                >
                                                    No
                                                </button>
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setConfirming(item.id)
                                                }
                                                disabled={processing}
                                                className="rounded p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    {!items.length && (
                        <tr>
                            <td
                                colSpan={columns.length + (readonly ? 0 : 1)}
                                className="px-3 py-6 text-center text-xs text-gray-400"
                            >
                                Sin registros —
                                {readonly ? '' : ' agrega el primero.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function AdministrationCatalogs({
    activityTypes,
    rooms,
    tracks,
    certificateTypes,
    budgetCategories,
    venues,
}: any) {
    const [activeTab, setActiveTab] = useState('activity_types');
    const { flash } = usePage().props as any;

    const tabData: Record<
        string,
        {
            title: string;
            items: CatalogItem[];
            columns: { key: string; label: string }[];
        }
    > = {
        activity_types: {
            title: 'Tipos de Actividad',
            items: activityTypes ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'code', label: 'Código' },
            ],
        },
        rooms: {
            title: 'Salas',
            items: rooms ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'capacity', label: 'Capacidad' },
                { key: 'building', label: 'Edificio' },
            ],
        },
        tracks: {
            title: 'Ejes Temáticos',
            items: tracks ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'description', label: 'Descripción' },
            ],
        },
        certificate_types: {
            title: 'Tipos de Constancia',
            items: certificateTypes ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'code', label: 'Código' },
            ],
        },
        budget_categories: {
            title: 'Categorías de Presupuesto',
            items: budgetCategories ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'code', label: 'Código' },
            ],
        },
        venues: {
            title: 'Sedes',
            items: venues ?? [],
            columns: [
                { key: 'name', label: 'Nombre' },
                { key: 'address', label: 'Dirección' },
            ],
        },
    };

    const current = tabData[activeTab];
    const currentTab = TABS.find((t) => t.key === activeTab);

    return (
        <div>
            <Head title="Catálogos" />

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

            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link
                    href="/admin/administration"
                    className="hover:text-gray-600"
                >
                    Administración
                </Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">
                    Catálogos
                </span>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Catálogos</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Configuración de tablas del sistema.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === t.key
                                    ? 'border-b-2 border-[#001e38] text-[#001e38] dark:border-[#dcc355] dark:text-[#dcc355]'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {t.label}
                            {t.readonly && (
                                <AlertTriangle
                                    size={10}
                                    className="text-amber-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <CatalogTable
                        title={current.title}
                        table={activeTab}
                        items={current.items}
                        columns={current.columns}
                        readonly={currentTab?.readonly ?? false}
                    />
                </div>
            </div>
        </div>
    );
}
