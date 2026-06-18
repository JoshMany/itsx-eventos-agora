import { Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

const typeLabels: Record<string, string> = {
    student: 'Estudiante',
    staff: 'Personal',
    external: 'Externo',
};
const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    attended: 'bg-blue-100 text-blue-700',
};

export default function ParticipantShow({ participant, registrations }: any) {
    return (
        <div>
            <Head
                title={`${participant.first_name} ${participant.last_name}`}
            />
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link
                        href="/admin/participants"
                        className="hover:text-gray-600"
                    >
                        Participantes
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 dark:text-gray-300">
                        {participant.first_name} {participant.last_name}
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border bg-white p-6 dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#001e38] text-xl font-semibold text-white">
                                {(participant.first_name?.[0] ?? '') +
                                    (participant.last_name?.[0] ?? '')}
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    {participant.first_name}{' '}
                                    {participant.last_name}
                                </h2>
                                <span
                                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeLabels[participant.type] ? 'bg-blue-100 text-blue-700' : ''}`}
                                >
                                    {typeLabels[participant.type] ??
                                        participant.type}
                                </span>
                            </div>
                        </div>
                        <dl className="mt-4 space-y-2 text-sm">
                            <div>
                                <dt className="text-xs text-gray-400">Email</dt>
                                <dd>{participant.email}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400">
                                    Telefono
                                </dt>
                                <dd>{participant.phone ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400">
                                    Organizacion
                                </dt>
                                <dd>{participant.organization_name ?? '—'}</dd>
                            </div>
                            {participant.student_number && (
                                <div>
                                    <dt className="text-xs text-gray-400">
                                        No. Control
                                    </dt>
                                    <dd>{participant.student_number}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                    <div className="rounded-xl border bg-white p-6 lg:col-span-2 dark:bg-gray-900">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                            <Calendar size={16} /> Historial de Eventos
                        </h2>
                        {registrations?.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="py-2 text-left text-xs font-medium text-gray-500">
                                            Evento
                                        </th>
                                        <th className="py-2 text-left text-xs font-medium text-gray-500">
                                            Estado
                                        </th>
                                        <th className="py-2 text-left text-xs font-medium text-gray-500">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {registrations.map((r: any) => (
                                        <tr key={r.id}>
                                            <td className="py-2">
                                                {r.event_title}
                                            </td>
                                            <td className="py-2">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status] ?? ''}`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-gray-500">
                                                {r.starts_at
                                                    ? new Date(
                                                          r.starts_at,
                                                      ).toLocaleDateString(
                                                          'es-MX',
                                                      )
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-400">
                                Sin eventos registrados.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
