import { Head } from '@inertiajs/react';

export default function AdministrationUsers({ users }: any) {
    return (
        <div>
            <Head title="Usuarios" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">
                        Gestión de Usuarios
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Cuentas de staff del sistema.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Roles
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users?.data?.length > 0 ? (
                                users.data.map((u: any) => (
                                    <tr
                                        key={u.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="text-foreground px-4 py-3 font-medium">
                                            {u.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {u.email}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-400">
                                            —
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-sm text-gray-400"
                                    >
                                        Sin usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
