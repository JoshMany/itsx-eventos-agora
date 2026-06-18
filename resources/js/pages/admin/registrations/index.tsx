import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    attended: 'bg-blue-100 text-blue-700',
};
const typeLabels: Record<string, string> = {
    student: 'Est.',
    staff: 'Pers.',
    external: 'Ext.',
};

export default function RegistrationsIndex({ event, registrations }: any) {
    const [search, setSearch] = useState('');

    return (
        <div>
            <Head title={`Asistentes - ${event?.title ?? ''}`} />
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-gray-900">
                        <Search size={16} className="text-gray-400" />
                        <input
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64 bg-transparent text-sm outline-none"
                        />
                    </div>
                    <div className="flex-1" />
                </div>
                <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Participante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Registrado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {registrations?.data
                                ?.filter((r: any) =>
                                    (
                                        r.first_name +
                                        ' ' +
                                        r.last_name +
                                        ' ' +
                                        r.email
                                    )
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                )
                                .map((r: any) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">
                                            {r.first_name} {r.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {typeLabels[r.type] ?? r.type}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status] ?? ''}`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {r.registered_at
                                                ? new Date(
                                                      r.registered_at,
                                                  ).toLocaleDateString('es-MX')
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
