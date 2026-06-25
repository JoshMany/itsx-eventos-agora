import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2, GripVertical } from 'lucide-react';

const STATUSES = [
    { value: 'draft', label: 'Borrador' },
    { value: 'pending_review', label: 'Pendiente de Revision' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'published', label: 'Publicado' },
    { value: 'finished', label: 'Finalizado' },
    { value: 'cancelled', label: 'Cancelado' },
];

interface Track {
    id: number | string;
    name: string;
    description: string;
}

interface EventFormProps {
    event?: {
        uuid: string;
        title: string;
        slug: string;
        short_description: string;
        description: string;
        status: string;
        capacity: string | null;
        starts_at: string;
        ends_at: string | null;
        registration_starts_at: string | null;
        registration_ends_at: string | null;
        venue_id: string | null;
        room_id: string | null;
    } | null;
    venues?: { id: number; name: string }[];
    tracks?: Track[];
}

export default function EventForm({
    event,
    venues,
    tracks: initialTracks,
}: EventFormProps) {
    const isEdit = !!event;
    const { data, setData, post, put, processing } = useForm({
        title: event?.title ?? '',
        slug: event?.slug ?? '',
        short_description: event?.short_description ?? '',
        description: event?.description ?? '',
        status: event?.status ?? 'draft',
        capacity: event?.capacity ?? '',
        starts_at: event?.starts_at?.slice(0, 16) ?? '',
        ends_at: event?.ends_at?.slice(0, 16) ?? '',
        registration_starts_at:
            event?.registration_starts_at?.slice(0, 16) ?? '',
        registration_ends_at: event?.registration_ends_at?.slice(0, 16) ?? '',
        venue_id: event?.venue_id ?? '',
        room_id: event?.room_id ?? '',
        tracks: initialTracks?.map((t: Track) => ({
            id: t.id,
            name: t.name,
            description: t.description ?? '',
        })) ?? [{ id: '', name: '', description: '' }],
    });

    const addTrack = () => {
        setData('tracks', [
            ...data.tracks,
            { id: '', name: '', description: '' },
        ]);
    };

    const removeTrack = (index: number) => {
        const updated = data.tracks.filter(
            (_: Track, i: number) => i !== index,
        );
        setData(
            'tracks',
            updated.length ? updated : [{ id: '', name: '', description: '' }],
        );
    };

    const updateTrack = (index: number, field: string, value: string) => {
        const updated = data.tracks.map((t: Track, i: number) =>
            i === index ? { ...t, [field]: value } : t,
        );
        setData('tracks', updated);
    };

    const moveTrack = (index: number, direction: 'up' | 'down') => {
        const updated = [...data.tracks];
        const target = direction === 'up' ? index - 1 : index + 1;

        if (target < 0 || target >= updated.length) {
            return;
        }

        const temp = updated[index];
        updated[index] = updated[target];
        updated[target] = temp;
        setData('tracks', updated);
    };

    const validTracks = data.tracks.filter((t: Track) => t.name.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/events/${event.uuid}`);
        } else {
            post('/admin/events');
        }
    };

    return (
        <div>
            <Head title={isEdit ? 'Editar Evento' : 'Crear Evento'} />

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link
                    href="/admin/events"
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                    Eventos
                </Link>
                {isEdit && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/admin/events/${event.uuid}`}
                            className="hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            {event.title}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">
                    {isEdit ? 'Editar' : 'Nuevo Evento'}
                </span>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-3xl space-y-6"
            >
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-sm font-semibold">
                        Informacion Basica
                    </h2>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titulo</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Nombre del evento"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="starts_at">Inicio</Label>
                                <Input
                                    id="starts_at"
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) =>
                                        setData('starts_at', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ends_at">Fin</Label>
                                <Input
                                    id="ends_at"
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) =>
                                        setData('ends_at', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(key) =>
                                        setData('status', key ?? 'draft')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map((s) => (
                                            <SelectItem
                                                key={s.value}
                                                value={s.value}
                                            >
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="venue_id">Sede</Label>
                                <Select
                                    value={data.venue_id}
                                    onValueChange={(key) =>
                                        setData('venue_id', key ?? '')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {venues?.map((v) => (
                                            <SelectItem
                                                key={v.id}
                                                value={String(v.id)}
                                            >
                                                {v.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacidad</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={data.capacity}
                                    onChange={(e) =>
                                        setData('capacity', e.target.value)
                                    }
                                    placeholder="Ilimitada"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-sm font-semibold">Descripcion</h2>
                    <div className="grid gap-2">
                        <Label htmlFor="short_description">
                            Descripcion corta
                        </Label>
                        <Textarea
                            id="short_description"
                            value={data.short_description}
                            onChange={(e) =>
                                setData('short_description', e.target.value)
                            }
                            placeholder="Descripcion corta (max 500 caracteres)"
                            className="h-20"
                            maxLength={500}
                        />
                    </div>
                    <div className="mt-3 grid gap-2">
                        <Label htmlFor="description">
                            Descripcion completa
                        </Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Descripcion completa"
                            className="h-32"
                        />
                    </div>
                </div>

                {/* Ejes Tematicos */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold">
                            Ejes Tematicos
                        </h2>
                        <button
                            type="button"
                            onClick={addTrack}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-[#001e38] hover:text-[#001e38] dark:border-gray-600 dark:hover:border-[#dcc355] dark:hover:text-[#dcc355]"
                        >
                            <Plus size={14} /> Agregar Eje
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.tracks.map((track: Track, index: number) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700/50 dark:bg-gray-800/30"
                            >
                                <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => moveTrack(index, 'up')}
                                        disabled={index === 0}
                                        className="rounded p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"
                                    >
                                        <svg
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="currentColor"
                                        >
                                            <path d="M5 0L10 6H0z" />
                                        </svg>
                                    </button>
                                    <GripVertical
                                        size={14}
                                        className="text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => moveTrack(index, 'down')}
                                        disabled={
                                            index === data.tracks.length - 1
                                        }
                                        className="rounded p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20"
                                    >
                                        <svg
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="currentColor"
                                        >
                                            <path d="M5 6L0 0h10z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-1 flex-col gap-2">
                                    <input
                                        type="text"
                                        value={track.name}
                                        onChange={(e) =>
                                            updateTrack(
                                                index,
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nombre del eje (ej. Inteligencia Artificial)"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                    />
                                    <input
                                        type="text"
                                        value={track.description}
                                        onChange={(e) =>
                                            updateTrack(
                                                index,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Descripcion opcional"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTrack(index)}
                                    className="mt-1.5 shrink-0 rounded p-1 text-gray-300 hover:text-red-500"
                                    title="Eliminar eje"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    {validTracks.length > 0 && (
                        <p className="mt-3 text-[11px] text-gray-400">
                            {validTracks.length} eje
                            {validTracks.length !== 1 ? 's' : ''} configurado
                            {validTracks.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
                    <Button
                        variant="outline"
                        onClick={() => setData('status', 'draft')}
                    >
                        Guardar Borrador
                    </Button>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            <Save size={16} />
                            {isEdit ? 'Actualizar' : 'Crear Evento'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
