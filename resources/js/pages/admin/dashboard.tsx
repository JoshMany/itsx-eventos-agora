import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Users,
    CheckSquare,
    Award,
    AlertTriangle,
    Clock,
    Plus,
    FileText,
} from 'lucide-react';

export default function AdminDashboard({
    stats,
    upcomingEvents,
    needsAttention,
}: any) {
    return (
        <div>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Quick stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Eventos activos',
                            value: stats?.events ?? 0,
                            icon: Calendar,
                            color: 'bg-blue-50 text-blue-600',
                        },
                        {
                            label: 'Inscripciones totales',
                            value: stats?.registrations ?? 0,
                            icon: Users,
                            color: 'bg-green-50 text-green-600',
                        },
                        {
                            label: 'Tasa de asistencia',
                            value: `${stats?.attendanceRate ?? 0}%`,
                            icon: CheckSquare,
                            color: 'bg-purple-50 text-purple-600',
                        },
                        {
                            label: 'Constancias pendientes',
                            value: stats?.pendingCertificates ?? 0,
                            icon: Award,
                            color: 'bg-yellow-50 text-yellow-600',
                        },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold">
                                        {value}
                                    </p>
                                </div>
                                <div className={`rounded-lg p-2 ${color}`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Upcoming events */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Clock size={16} /> Próximos eventos
                        </h2>
                        {upcomingEvents?.length > 0 ? (
                            <div className="space-y-2">
                                {upcomingEvents.map((e: any) => (
                                    <Link
                                        key={e.uuid}
                                        href={`/admin/events/${e.uuid}`}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[#001e38] dark:text-[#dcc355]">
                                                {e.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(
                                                    e.starts_at,
                                                ).toLocaleDateString('es-MX', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                })}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No hay eventos próximos programados.
                            </p>
                        )}
                    </div>

                    {/* Needs attention + quick actions */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                <AlertTriangle
                                    size={16}
                                    className="text-yellow-500"
                                />{' '}
                                Requiere atención
                            </h2>
                            <div className="space-y-2">
                                {needsAttention?.pending_review > 0 && (
                                    <Link
                                        href="/admin/events"
                                        className="flex items-center justify-between rounded-lg bg-yellow-50 px-3 py-2 text-sm dark:bg-yellow-900/20"
                                    >
                                        <span className="text-yellow-700 dark:text-yellow-400">
                                            {needsAttention.pending_review}{' '}
                                            eventos por revisar
                                        </span>
                                        <span className="text-xs text-yellow-500">
                                            Revisar →
                                        </span>
                                    </Link>
                                )}
                                {needsAttention?.pending_registrations > 0 && (
                                    <div className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 text-sm dark:bg-orange-900/20">
                                        <span className="text-orange-700 dark:text-orange-400">
                                            {
                                                needsAttention.pending_registrations
                                            }{' '}
                                            inscripciones pendientes
                                        </span>
                                    </div>
                                )}
                                {needsAttention?.uncertified > 0 && (
                                    <Link
                                        href="/admin/certificates"
                                        className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm dark:bg-red-900/20"
                                    >
                                        <span className="text-red-700 dark:text-red-400">
                                            {needsAttention.uncertified}{' '}
                                            constancias sin generar
                                        </span>
                                        <span className="text-xs text-red-500">
                                            Ver →
                                        </span>
                                    </Link>
                                )}
                                {!needsAttention?.pending_review &&
                                    !needsAttention?.pending_registrations &&
                                    !needsAttention?.uncertified && (
                                        <p className="text-sm text-gray-400">
                                            Todo al día ✓
                                        </p>
                                    )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                Acciones rápidas
                            </h2>
                            <div className="space-y-2">
                                <Link
                                    href="/admin/events/create"
                                    className="flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38]"
                                >
                                    <Plus size={16} />
                                    Nuevo evento
                                </Link>
                                <Link
                                    href="/admin/participants/create"
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <Users size={16} />
                                    Registrar participante
                                </Link>
                                <Link
                                    href="/admin/certificates"
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <FileText size={16} />
                                    Ver constancias
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
