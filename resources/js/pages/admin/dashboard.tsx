import { Head } from '@inertiajs/react';
import {
    Calendar,
    Users,
    CheckSquare,
    Award,
    AlertTriangle,
    Activity,
} from 'lucide-react';

type StatCardProps = {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    color: string;
};
function StatCard({ label, value, sub, icon: Icon, color }: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold">{value}</p>
                    {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
                </div>
                <div className={`rounded-lg p-2 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard({
    stats,
    upcomingEvents,
    recentActivity,
}: any) {
    return (
        <div>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* KPI Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Eventos activos"
                        value={stats?.events ?? 0}
                        icon={Calendar}
                        color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    />
                    <StatCard
                        label="Registros totales"
                        value={stats?.registrations ?? 0}
                        icon={Users}
                        color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                    />
                    <StatCard
                        label="Tasa de asistencia"
                        value={`${stats?.attendanceRate ?? 0}%`}
                        icon={CheckSquare}
                        color="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                    />
                    <StatCard
                        label="Constancias pendientes"
                        value={stats?.pendingCertificates ?? 0}
                        icon={Award}
                        color="bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Upcoming Events */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Calendar size={16} /> Proximos Eventos
                        </h2>
                        {upcomingEvents?.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingEvents.map((e: any) => (
                                    <div
                                        key={e.uuid}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-800"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {e.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(
                                                    e.starts_at,
                                                ).toLocaleDateString('es-MX', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                            Publicado
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No hay eventos proximos.
                            </p>
                        )}
                    </div>
                    {/* Alerts */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                            <AlertTriangle size={16} /> Requiere Atencion
                        </h2>
                        <div className="space-y-3">
                            {stats?.pendingEvents > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                    <span>
                                        {stats.pendingEvents} eventos pendientes
                                        de revision
                                    </span>
                                </div>
                            )}
                            {stats?.pendingCertificates > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <span>
                                        {stats.pendingCertificates} constancias
                                        por generar
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <Activity size={16} /> Actividad Reciente
                    </h2>
                    <div className="space-y-2">
                        {recentActivity
                            ?.slice(0, 8)
                            .map((a: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    <span className="font-medium">
                                        {a.first_name} {a.last_name}
                                    </span>
                                    <span className="text-gray-400">
                                        se registro en
                                    </span>
                                    <span>{a.event_title}</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {new Date(
                                            a.created_at,
                                        ).toLocaleDateString('es-MX')}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
