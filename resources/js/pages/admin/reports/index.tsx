import { Head } from '@inertiajs/react';
import { Calendar, Users, ClipboardCheck, Award, Clock } from 'lucide-react';

const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    pending_review: 'Pendiente',
    approved: 'Aprobado',
    published: 'Publicado',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
};
const statusBarColors: Record<string, string> = {
    draft: 'bg-gray-300',
    pending_review: 'bg-yellow-400',
    approved: 'bg-blue-500',
    published: 'bg-green-500',
    finished: 'bg-purple-500',
    cancelled: 'bg-red-400',
};

const typeLabels: Record<string, string> = {
    student: 'Estudiante',
    staff: 'Personal',
    external: 'Externo',
};
const typeBarColors: Record<string, string> = {
    student: 'bg-blue-400',
    staff: 'bg-purple-400',
    external: 'bg-gray-400',
};

const regStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    attended: 'Asistió',
};
const regStatusBarColors: Record<string, string> = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-400',
    cancelled: 'bg-red-400',
    attended: 'bg-green-500',
};

function BarSection({
    title,
    items,
    total,
    labels,
    colors,
}: {
    title: string;
    items: { [key: string]: number };
    total: number;
    labels: Record<string, string>;
    colors: Record<string, string>;
}) {
    return (
        <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {title}
            </h3>
            <div className="space-y-2">
                {Object.entries(items)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                        const pct =
                            total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                        return (
                            <div key={key} className="flex items-center gap-3">
                                <span className="w-24 text-xs text-gray-500">
                                    {labels[key] ?? key}
                                </span>
                                <div className="flex-1">
                                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className={`h-full rounded-full transition-all ${colors[key] ?? 'bg-gray-300'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="w-16 text-right text-xs tabular-nums text-gray-500">
                                    {count} ({pct}%)
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default function ReportsIndex({
    eventCount,
    participantCount,
    registrationCount,
    certificateCount,
    eventsByStatus,
    participantsByType,
    registrationsByStatus,
    recentEvents,
}: any) {
    const eventsMap = Object.fromEntries(
        (eventsByStatus ?? []).map((e: any) => [e.status, Number(e.count)]),
    );
    const participantsMap = Object.fromEntries(
        (participantsByType ?? []).map((p: any) => [p.type, Number(p.count)]),
    );
    const registrationsMap = Object.fromEntries(
        (registrationsByStatus ?? []).map((r: any) => [
            r.status,
            Number(r.count),
        ]),
    );

    return (
        <div>
            <Head title="Reportes" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Reportes</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Métricas institucionales de la plataforma ÁGORA.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        {
                            label: 'Eventos',
                            value: eventCount,
                            icon: Calendar,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50 dark:bg-blue-900/20',
                        },
                        {
                            label: 'Participantes',
                            value: participantCount,
                            icon: Users,
                            color: 'text-purple-600',
                            bg: 'bg-purple-50 dark:bg-purple-900/20',
                        },
                        {
                            label: 'Inscripciones',
                            value: registrationCount,
                            icon: ClipboardCheck,
                            color: 'text-green-600',
                            bg: 'bg-green-50 dark:bg-green-900/20',
                        },
                        {
                            label: 'Constancias',
                            value: certificateCount,
                            icon: Award,
                            color: 'text-[#001e38] dark:text-[#dcc355]',
                            bg: 'bg-gray-50 dark:bg-gray-900/50',
                        },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
                                >
                                    <Icon size={20} className={color} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {(value ?? 0).toLocaleString('es-MX')}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <BarSection
                            title="Eventos por estado"
                            items={eventsMap}
                            total={eventCount}
                            labels={statusLabels}
                            colors={statusBarColors}
                        />
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <BarSection
                            title="Participantes por tipo"
                            items={participantsMap}
                            total={participantCount}
                            labels={typeLabels}
                            colors={typeBarColors}
                        />
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <BarSection
                            title="Inscripciones por estado"
                            items={registrationsMap}
                            total={registrationCount}
                            labels={regStatusLabels}
                            colors={regStatusBarColors}
                        />
                    </div>
                </div>

                {/* Recent events */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Clock size={14} />
                        Últimos eventos
                    </h3>
                    {!recentEvents?.length ? (
                        <p className="text-sm text-gray-400">Sin eventos</p>
                    ) : (
                        <div className="space-y-2">
                            {recentEvents.map((e: any) => (
                                <div
                                    key={e.title}
                                    className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-0 dark:border-gray-800"
                                >
                                    <span className="text-foreground font-medium">
                                        {e.title}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">
                                            {e.starts_at
                                                ? new Date(
                                                      e.starts_at,
                                                  ).toLocaleDateString('es-MX')
                                                : '—'}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBarColors[e.status] ?? ''} text-white`}
                                        >
                                            {statusLabels[e.status] ?? e.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
