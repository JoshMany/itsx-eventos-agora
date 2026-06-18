import {
    Button,
    Input,
    Label,
    ListBox,
    Select,
    TextField,
} from '@heroui/react';
import { router, useForm } from '@inertiajs/react';
import { Loader2, Search, UserPlus, X } from 'lucide-react';
import React, { useState } from 'react';

interface ParticipantResult {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    type: string;
    student_number: string | null;
    organization_name: string | null;
    organization_acronym: string | null;
}

interface RegistrationModalProps {
    eventUuid: string;
    onClose: () => void;
}

export default function RegistrationModal({
    eventUuid,
    onClose,
}: RegistrationModalProps) {
    const [mode, setMode] = useState<'search' | 'create'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ParticipantResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedParticipant, setSelectedParticipant] =
        useState<ParticipantResult | null>(null);

    const { data, setData, post, processing } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        type: 'student',
        phone: '',
        organization_name: '',
        student_number: '',
    });

    const doSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        setSearching(true);

        try {
            const res = await fetch(
                `/admin/events/${eventUuid}/registrations/search?q=${encodeURIComponent(searchQuery)}`,
            );
            const json = await res.json();
            setSearchResults(json);
        } finally {
            setSearching(false);
        }
    };

    const registerExisting = (participant: ParticipantResult) => {
        router.post(
            `/admin/events/${eventUuid}/registrations`,
            {
                participant_id: participant.id,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => onClose(),
            },
        );
    };

    const registerNew = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/events/${eventUuid}/registrations`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <h2 className="text-sm font-semibold">
                        Registrar Asistente
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Toggle mode */}
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setMode('search')}
                        className={`flex-1 px-4 py-2.5 text-xs font-medium ${mode === 'search' ? 'border-b-2 border-[#001e38] text-[#001e38] dark:border-[#dcc355] dark:text-[#dcc355]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Buscar existente
                    </button>
                    <button
                        onClick={() => setMode('create')}
                        className={`flex-1 px-4 py-2.5 text-xs font-medium ${mode === 'create' ? 'border-b-2 border-[#001e38] text-[#001e38] dark:border-[#dcc355] dark:text-[#dcc355]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Nuevo participante
                    </button>
                </div>

                <div className="p-5">
                    {mode === 'search' ? (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && doSearch()
                                    }
                                    placeholder="Buscar por nombre, email o matrícula..."
                                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                />
                                <button
                                    onClick={doSearch}
                                    disabled={searching}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#001e38] px-3 py-2 text-sm text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                                >
                                    {searching ? (
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Search size={14} />
                                    )}
                                </button>
                            </div>

                            {selectedParticipant ? (
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {selectedParticipant.first_name}{' '}
                                                {selectedParticipant.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {selectedParticipant.email}
                                            </p>
                                            {selectedParticipant.organization_name && (
                                                <p className="text-xs text-gray-400">
                                                    {
                                                        selectedParticipant.organization_name
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="primary"
                                            onPress={() =>
                                                registerExisting(
                                                    selectedParticipant,
                                                )
                                            }
                                        >
                                            Registrar
                                        </Button>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-60 space-y-1 overflow-y-auto">
                                    {searchResults.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() =>
                                                setSelectedParticipant(p)
                                            }
                                            className="w-full rounded-lg border border-gray-100 p-3 text-left hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                        >
                                            <p className="text-sm font-medium">
                                                {p.first_name} {p.last_name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{p.email}</span>
                                                {p.student_number && (
                                                    <span>
                                                        • {p.student_number}
                                                    </span>
                                                )}
                                                {p.organization_acronym && (
                                                    <span>
                                                        •{' '}
                                                        {p.organization_acronym}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : searchQuery && !searching ? (
                                <p className="py-8 text-center text-sm text-gray-400">
                                    Sin resultados. Cambia a &quot;Nuevo
                                    participante&quot; para crear uno.
                                </p>
                            ) : null}
                        </div>
                    ) : (
                        <form onSubmit={registerNew} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <TextField
                                    className="w-full"
                                    name="first_name"
                                    isRequired
                                >
                                    <Label>Nombre(s)</Label>
                                    <Input
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Juan"
                                    />
                                </TextField>
                                <TextField
                                    className="w-full"
                                    name="last_name"
                                    isRequired
                                >
                                    <Label>Apellidos</Label>
                                    <Input
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        placeholder="Pérez"
                                    />
                                </TextField>
                            </div>
                            <TextField
                                className="w-full"
                                name="email"
                                isRequired
                            >
                                <Label>Correo electrónico</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="juan@example.com"
                                />
                            </TextField>
                            <Select
                                selectedKey={data.type}
                                onSelectionChange={(key) =>
                                    setData('type', key as string)
                                }
                                className="w-full"
                                placeholder="Seleccionar..."
                            >
                                <Label>Tipo</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item
                                            id="student"
                                            textValue="Estudiante"
                                        >
                                            Estudiante
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                        <ListBox.Item
                                            id="staff"
                                            textValue="Personal"
                                        >
                                            Personal
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                        <ListBox.Item
                                            id="external"
                                            textValue="Externo"
                                        >
                                            Externo
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                            <div className="grid grid-cols-2 gap-3">
                                <TextField className="w-full" name="phone">
                                    <Label>Teléfono</Label>
                                    <Input
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="2281234567"
                                    />
                                </TextField>
                                <TextField
                                    className="w-full"
                                    name="student_number"
                                >
                                    <Label>Matrícula</Label>
                                    <Input
                                        value={data.student_number}
                                        onChange={(e) =>
                                            setData(
                                                'student_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="ZS21000001"
                                    />
                                </TextField>
                            </div>
                            <TextField
                                className="w-full"
                                name="organization_name"
                            >
                                <Label>Institución / Organización</Label>
                                <Input
                                    value={data.organization_name}
                                    onChange={(e) =>
                                        setData(
                                            'organization_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ITSX"
                                />
                            </TextField>

                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                <Button variant="tertiary" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    isDisabled={processing}
                                    variant="primary"
                                >
                                    {processing ? (
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <UserPlus size={14} />
                                    )}
                                    Registrar
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
