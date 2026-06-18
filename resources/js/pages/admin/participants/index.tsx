import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

const typeLabels: Record<string, string> = {
    student: 'Estudiante',
    staff: 'Personal',
    external: 'Externo',
};
const typeColors: Record<string, string> = {
    student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    staff: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    external: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function ParticipantsIndex({ participants }: any) {
    const [search, setSearch] = useState('');

    return (
        <div>
            <Head title="Participantes" />
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
                    <span className="text-sm text-gray-400">
                        {participants?.total ?? 0} participantes
                    </span>
                </div>
                <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Participante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Organizacion
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {participants?.data
                                ?.filter((p: any) =>
                                    (
                                        p.first_name +
                                        ' ' +
                                        p.last_name +
                                        ' ' +
                                        p.email
                                    )
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                )
                                .map((p: any) => (
                                    <tr
                                        key={p.uuid}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/participants/${p.uuid}`}
                                                className="font-medium text-[#001e38] hover:underline dark:text-[#dcc355]"
                                            >
                                                {p.first_name} {p.last_name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[p.type] ?? ''}`}
                                            >
                                                {typeLabels[p.type] ?? p.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {p.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {p.organization_name ?? '—'}
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
