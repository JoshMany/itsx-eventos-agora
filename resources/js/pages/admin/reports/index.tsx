import { Head } from '@inertiajs/react';
import { Calendar, Users, ClipboardCheck, Award } from 'lucide-react';

const statsCards = [
    {
        label: 'Eventos',
        key: 'eventCount',
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
        label: 'Participantes',
        key: 'participantCount',
        icon: Users,
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
        label: 'Inscripciones',
        key: 'registrationCount',
        icon: ClipboardCheck,
        color: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
        label: 'Constancias',
        key: 'certificateCount',
        icon: Award,
        color: 'text-[#001e38] dark:text-[#dcc355]',
        bg: 'bg-gray-50 dark:bg-gray-900/50',
    },
];

export default function ReportsIndex({
    eventCount,
    participantCount,
    registrationCount,
    certificateCount,
}: any) {
    const data: Record<string, number> = {
        eventCount,
        participantCount,
        registrationCount,
        certificateCount,
    };

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

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statsCards.map(({ label, key, icon: Icon, color, bg }) => (
                        <div
                            key={key}
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
                                        {(data[key] ?? 0).toLocaleString(
                                            'es-MX',
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">
                        Módulo de reportes en desarrollo
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Próximamente: gráficos, exportaciones avanzadas y
                        filtros por período.
                    </p>
                </div>
            </div>
        </div>
    );
}
