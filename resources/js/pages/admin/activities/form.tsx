import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';

export default function ActivityForm({
    event,
    activity,
    tracks,
    activityTypes,
    rooms,
}: any) {
    const isEdit = !!activity;
    const { data, setData, post, put, processing, errors } = useForm({
        title: activity?.title ?? '',
        activity_type_id: activity?.activity_type_id?.toString() ?? '',
        track_id: activity?.track_id?.toString() ?? '',
        description: activity?.description ?? '',
        capacity: activity?.capacity ?? '',
        starts_at: activity?.starts_at?.slice(0, 16) ?? '',
        ends_at: activity?.ends_at?.slice(0, 16) ?? '',
        room_id: activity?.room_id?.toString() ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const base = `/admin/events/${event.uuid}/activities`;
        isEdit ? put(`${base}/${activity.uuid}`) : post(base);
    };

    const selectedType = activityTypes?.find(
        (t: any) => t.id.toString() === data.activity_type_id,
    );
    return (
        <div className="space-y-4">
            <Head title={isEdit ? 'Editar Actividad' : 'Nueva Actividad'} />
            <div className="flex items-center gap-3 text-sm text-gray-400">
                <Link
                    href={`/admin/events/${event.uuid}/activities`}
                    className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <ArrowLeft size={14} /> Actividades
                </Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">
                    {isEdit ? activity.title : 'Nueva Actividad'}
                </span>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-2xl space-y-6"
            >
                {/* Basic info */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-sm font-semibold">
                        Informacion de la Actividad
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Titulo *
                            </label>
                            <input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">
                                    Tipo *
                                </label>
                                <select
                                    value={data.activity_type_id}
                                    onChange={(e) =>
                                        setData(
                                            'activity_type_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {activityTypes?.map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">
                                    Eje Temático
                                </label>
                                <select
                                    value={data.track_id}
                                    onChange={(e) =>
                                        setData('track_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">Sin eje</option>
                                    {tracks?.map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {selectedType && (
                            <div className="flex gap-2 text-xs">
                                {selectedType.supports_speakers && (
                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        🎤 Ponentes
                                    </span>
                                )}
                                {selectedType.supports_teams && (
                                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                        👥 Equipos
                                    </span>
                                )}
                                {selectedType.supports_certificates && (
                                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        🏅 Constancias
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Schedule & Location */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-sm font-semibold">
                        Horario y Ubicacion
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Inicio *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.starts_at}
                                onChange={(e) =>
                                    setData('starts_at', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Fin
                            </label>
                            <input
                                type="datetime-local"
                                value={data.ends_at}
                                onChange={(e) =>
                                    setData('ends_at', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Sala
                            </label>
                            <select
                                value={data.room_id}
                                onChange={(e) =>
                                    setData('room_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="">Sin asignar</option>
                                {rooms?.map((r: any) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Capacidad
                            </label>
                            <input
                                type="number"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData('capacity', e.target.value)
                                }
                                placeholder="Ej. 40"
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-sm font-semibold">Descripcion</h2>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        placeholder="Describe la actividad, requisitos, materiales necesarios..."
                        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end rounded-xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/events/${event.uuid}/activities`}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                        >
                            <Save size={16} />
                            {isEdit ? 'Actualizar' : 'Crear Actividad'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
