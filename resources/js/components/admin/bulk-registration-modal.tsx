import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Loader2, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface FilterCriteria {
    organizations: { id: number; name: string; acronym: string | null }[];
    careers: { id: number; name: string; code: string | null }[];
    generations: string[];
    professors: {
        id: number;
        first_name: string;
        last_name: string;
        department: string | null;
    }[];
    subjects: { id: number; name: string; code: string | null }[];
}

interface PreviewResult {
    total: number;
    new: number;
    already_registered: number;
    participants: any[];
}

interface BulkRegistrationModalProps {
    eventUuid: string;
    onClose: () => void;
}

export default function BulkRegistrationModal({
    eventUuid,
    onClose,
}: BulkRegistrationModalProps) {
    const [criterias, setCriterias] = useState<FilterCriteria | null>(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<PreviewResult | null>(null);
    const [previewing, setPreviewing] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        fetch(`/admin/events/${eventUuid}/registrations/filter-criterias`)
            .then((r) => r.json())
            .then((data) => {
                setCriterias(data);
                setLoading(false);
            });
    }, [eventUuid]);

    const hasFilters = Object.values(filters).some((v) => v);

    const doPreview = async () => {
        if (!hasFilters) {
            return;
        }

        setPreviewing(true);
        setPreview(null);

        try {
            const res = await fetch(
                `/admin/events/${eventUuid}/registrations/preview-filter`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name=csrf-token]')
                                ?.getAttribute('content') ?? '',
                    },
                    body: JSON.stringify(filters),
                },
            );
            const data = await res.json();
            setPreview(data);
        } finally {
            setPreviewing(false);
        }
    };

    const doBulkRegister = () => {
        setRegistering(true);
        router.post(`/admin/events/${eventUuid}/registrations/bulk`, filters, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setRegistered(true);
                onClose();
            },
            onFinish: () => setRegistering(false),
        });
    };

    const setFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value || '' }));
        setPreview(null);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Registro Masivo
                        </h2>
                        <p className="text-xs text-gray-400">
                            Filtra estudiantes por criterios académicos
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2
                                size={20}
                                className="animate-spin text-gray-400"
                            />
                        </div>
                    ) : (
                        <>
                            {/* Filters grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Institución
                                    </label>
                                    <select
                                        value={filters.organization_id ?? ''}
                                        onChange={(e) =>
                                            setFilter(
                                                'organization_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Todas</option>
                                        {criterias?.organizations.map((o) => (
                                            <option key={o.id} value={o.id}>
                                                {o.acronym
                                                    ? `${o.acronym} - ${o.name}`
                                                    : o.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Carrera
                                    </label>
                                    <select
                                        value={filters.career_id ?? ''}
                                        onChange={(e) =>
                                            setFilter(
                                                'career_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Todas</option>
                                        {criterias?.careers.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code
                                                    ? `${c.code} - ${c.name}`
                                                    : c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Generación
                                    </label>
                                    <select
                                        value={filters.generation ?? ''}
                                        onChange={(e) =>
                                            setFilter(
                                                'generation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Todas</option>
                                        {criterias?.generations.map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Profesor
                                    </label>
                                    <select
                                        value={filters.professor_id ?? ''}
                                        onChange={(e) =>
                                            setFilter(
                                                'professor_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Todos</option>
                                        {criterias?.professors.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.first_name} {p.last_name}
                                                {p.department
                                                    ? ` (${p.department})`
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Materia
                                    </label>
                                    <select
                                        value={filters.subject_id ?? ''}
                                        onChange={(e) =>
                                            setFilter(
                                                'subject_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Todas</option>
                                        {criterias?.subjects.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.code
                                                    ? `${s.code} - ${s.name}`
                                                    : s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={doPreview}
                                        disabled={!hasFilters || previewing}
                                        className="w-full rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                                    >
                                        {previewing ? (
                                            <Loader2
                                                size={14}
                                                className="mx-auto animate-spin"
                                            />
                                        ) : (
                                            'Previsualizar'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Active filters indicator */}
                            {activeFilterCount > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                                    <span className="font-medium">
                                        {activeFilterCount} filtro
                                        {activeFilterCount !== 1
                                            ? 's'
                                            : ''}{' '}
                                        activo
                                        {activeFilterCount !== 1 ? 's' : ''}:
                                    </span>
                                    {Object.entries(filters)
                                        .filter(([, v]) => v)
                                        .map(([key]) => (
                                            <span
                                                key={key}
                                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800"
                                            >
                                                {key === 'organization_id' &&
                                                    'Institución'}
                                                {key === 'career_id' &&
                                                    'Carrera'}
                                                {key === 'generation' &&
                                                    'Generación'}
                                                {key === 'professor_id' &&
                                                    'Profesor'}
                                                {key === 'subject_id' &&
                                                    'Materia'}
                                                <button
                                                    onClick={() =>
                                                        setFilter(key, '')
                                                    }
                                                    className="hover:text-gray-700"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                </div>
                            )}

                            {/* Preview results */}
                            {preview && (
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users
                                                size={20}
                                                className="text-gray-400"
                                            />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {preview.total} estudiantes
                                                    encontrados
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {preview.already_registered}{' '}
                                                    ya registrados •{' '}
                                                    {preview.new} disponibles
                                                    para registrar
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {preview.participants.length > 0 && (
                                        <div className="mb-3 max-h-40 overflow-y-auto rounded border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">
                                                            Nombre
                                                        </th>
                                                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">
                                                            Matrícula
                                                        </th>
                                                        <th className="px-3 py-1.5 text-left font-medium text-gray-500">
                                                            Carrera
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y dark:divide-gray-800">
                                                    {preview.participants
                                                        .slice(0, 10)
                                                        .map((p: any) => (
                                                            <tr key={p.id}>
                                                                <td className="px-3 py-1.5">
                                                                    {
                                                                        p.first_name
                                                                    }{' '}
                                                                    {
                                                                        p.last_name
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-1.5 text-gray-500">
                                                                    {p.student_number ??
                                                                        '—'}
                                                                </td>
                                                                <td className="px-3 py-1.5 text-gray-500">
                                                                    {p.career_name ??
                                                                        '—'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    {preview.participants
                                                        .length > 10 && (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className="px-3 py-1.5 text-center text-gray-400"
                                                            >
                                                                ... y{' '}
                                                                {preview
                                                                    .participants
                                                                    .length -
                                                                    10}{' '}
                                                                más
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            disabled={
                                                preview.new === 0 || registering
                                            }
                                            onClick={doBulkRegister}
                                        >
                                            {registering ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Users size={14} />
                                            )}
                                            Registrar {preview.new} asistente
                                            {preview.new !== 1 ? 's' : ''}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
