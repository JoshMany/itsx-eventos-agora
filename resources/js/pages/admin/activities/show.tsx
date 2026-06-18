import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Layers, Pencil } from 'lucide-react';

export default function ActivityShow({ event, activity }: any) {
    return (
        <div className="space-y-4">
            <Head title={`${activity.title}`} />
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
                        href={`/admin/events/${event.uuid}`}
                        className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {event.title}
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/admin/events/${event.uuid}/activities`}
                        className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        Actividades
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 dark:text-gray-300">
                        {activity.title}
                    </span>
                </div>
                <div className="flex-1" />
                <Link
                    href={`/admin/events/${event.uuid}/activities/${activity.uuid}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    <Pencil size={14} /> Editar
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Main info */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-1 text-lg font-semibold">
                        {activity.title}
                    </h2>
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                        {activity.type_name}
                    </span>
                    {activity.description && (
                        <p className="mt-4 text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                            {activity.description}
                        </p>
                    )}
                    {!activity.description && (
                        <p className="mt-4 text-sm text-gray-400 italic">
                            Sin descripcion.
                        </p>
                    )}
                </div>

                {/* Metadata sidebar */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar size={13} /> Fecha
                            </dt>
                            <dd className="mt-1 font-medium">
                                {activity.starts_at
                                    ? new Date(
                                          activity.starts_at,
                                      ).toLocaleDateString('es-MX', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock size={13} /> Horario
                            </dt>
                            <dd className="mt-1 font-medium">
                                {activity.starts_at
                                    ? new Date(
                                          activity.starts_at,
                                      ).toLocaleTimeString('es-MX', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : '—'}
                                {activity.ends_at
                                    ? ` - ${new Date(activity.ends_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                                    : ''}
                            </dd>
                        </div>
                        {activity.room_name && (
                            <div>
                                <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <MapPin size={13} /> Sala
                                </dt>
                                <dd className="mt-1 font-medium">
                                    {activity.room_name}
                                </dd>
                            </div>
                        )}
                        {activity.track_name && (
                            <div>
                                <dt className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Layers size={13} /> Eje Temático
                                </dt>
                                <dd className="mt-1 font-medium">
                                    {activity.track_name}
                                </dd>
                            </div>
                        )}
                        <div>
                            <dt className="text-xs text-gray-400">Capacidad</dt>
                            <dd className="mt-1 font-medium">
                                {activity.capacity ?? 'Sin limite'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
