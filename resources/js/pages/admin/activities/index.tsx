import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Calendar,
    Clock,
    MapPin,
    Layers,
    Pencil,
    Trash2,
} from 'lucide-react';

const typeIcons: Record<string, string> = {
    conference: '🎤',
    workshop: '🔧',
    contest: '🏆',
    hackathon: '💻',
    panel: '🗣️',
    round_table: '🫱',
    networking: '🤝',
    exhibition: '🖼️',
    course: '📚',
    seminar: '🎓',
    ceremony: '🎭',
    performance: '🎵',
    meeting: '📋',
    other: '📌',
};

export default function ActivitiesIndex({ event, activities }: any) {
    const hasActivities = activities?.length > 0;
    return (
        <div className="space-y-4">
            <Head title={`Actividades - ${event?.title ?? ''}`} />
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link
                        href="/admin/events"
                        className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        Eventos
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/admin/events/${event?.uuid}`}
                        className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {event?.title}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 dark:text-gray-300">
                        Actividades
                    </span>
                </div>
                <div className="flex-1" />
                <Link
                    href={`/admin/events/${event?.uuid}/activities/create`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                >
                    <Plus size={16} /> Nueva Actividad
                </Link>
            </div>

            {!hasActivities ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                    <Layers
                        size={40}
                        className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                    />
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sin actividades
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                        Agrega conferencias, talleres, concursos y mas a este
                        evento.
                    </p>
                    <Link
                        href={`/admin/events/${event?.uuid}/activities/create`}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38]"
                    >
                        Crear primera actividad
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actividad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Eje
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Sala
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {activities.map((a: any) => (
                                <tr
                                    key={a.uuid}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/events/${event.uuid}/activities/${a.uuid}`}
                                            className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                                        >
                                            {typeIcons[a.type_code] ?? '📌'}{' '}
                                            {a.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {a.type_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {a.track_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {a.starts_at
                                            ? new Date(
                                                  a.starts_at,
                                              ).toLocaleDateString('es-MX', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {a.room_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/events/${event.uuid}/activities/${a.uuid}/edit`}
                                                className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <Link
                                                href={`/admin/events/${event.uuid}/activities/${a.uuid}`}
                                                as="button"
                                                method="delete"
                                                className="rounded p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
