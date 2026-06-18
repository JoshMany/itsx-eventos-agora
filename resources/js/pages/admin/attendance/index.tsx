import { Head, useForm } from '@inertiajs/react';
import { Search, Check } from 'lucide-react';
import { useState } from 'react';

export default function AttendanceIndex({ event, registrations, stats }: any) {
    const [search, setSearch] = useState('');
    const { post, processing } = useForm();
    const handleCheckIn = (regId: number) =>
        post(`/admin/events/${event.uuid}/attendance`, {
            registration_id: regId,
        });

    const progress =
        stats?.total > 0
            ? Math.round((stats.checkedIn / stats.total) * 100)
            : 0;

    return (
        <div>
            <Head title={`Asistencia - ${event?.title ?? ''}`} />
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">Registrados</p>
                        <p className="text-2xl font-bold">
                            {stats?.total ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">Check-in</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats?.checkedIn ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900">
                        <p className="text-xs text-gray-400">Avance</p>
                        <p className="text-2xl font-bold text-[#001e38] dark:text-[#dcc355]">
                            {progress}%
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-gray-900">
                        <Search size={16} className="text-gray-400" />
                        <input
                            placeholder="Buscar participante..."
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
                                    Participante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Check-in
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {registrations
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
                                            {r.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.checked_in_at ? (
                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                    <Check size={14} />
                                                    {new Date(
                                                        r.checked_in_at,
                                                    ).toLocaleTimeString(
                                                        'es-MX',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {!r.checked_in_at && (
                                                <button
                                                    onClick={() =>
                                                        handleCheckIn(r.id)
                                                    }
                                                    disabled={processing}
                                                    className="rounded-lg bg-[#001e38] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#002d54] disabled:opacity-50"
                                                >
                                                    Check-in
                                                </button>
                                            )}
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
