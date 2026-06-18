import { Head } from '@inertiajs/react';

export default function AdministrationRoles({ roles }: any) {
    return (
        <div>
            <Head title="Roles" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Roles y Permisos</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Configuración de roles del sistema.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Rol
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                    Guard
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {roles?.length > 0 ? (
                                roles.map((r: any) => (
                                    <tr
                                        key={r.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="text-foreground px-4 py-3 font-medium capitalize">
                                            {r.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {r.guard_name}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-4 py-8 text-center text-sm text-gray-400"
                                    >
                                        Sin roles configurados.
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
