import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function CertificatesIndex({ certificates }: any) {
    const [search, setSearch] = useState('');

    return (
        <div>
            <Head title="Constancias" />
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
                </div>
                <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Folio
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Participante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Evento
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Generada
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {certificates?.data
                                ?.filter((c: any) =>
                                    (
                                        c.first_name +
                                        ' ' +
                                        c.last_name +
                                        ' ' +
                                        c.folio +
                                        ' ' +
                                        c.event_title
                                    )
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                )
                                .map((c: any) => (
                                    <tr
                                        key={c.uuid}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/admin/certificates/${c.uuid}`}
                                                className="font-mono text-xs font-medium text-[#001e38] dark:text-[#dcc355]"
                                            >
                                                {c.folio}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.first_name} {c.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {c.event_title}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {c.generated_at
                                                ? new Date(
                                                      c.generated_at,
                                                  ).toLocaleDateString('es-MX')
                                                : 'Pendiente'}
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
