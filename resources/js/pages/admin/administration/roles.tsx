import { Head, Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function AdministrationRoles({ roles }: any) {
    return (
        <div>
            <Head title="Roles" />
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                <Link
                    href="/admin/administration"
                    className="hover:text-gray-600"
                >
                    Administración
                </Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-300">Roles</span>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Roles</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {roles?.length ?? 0} roles configurados en el
                            sistema.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roles?.map((r: any) => (
                        <div
                            key={r.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-[#001e38] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#dcc355]"
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-foreground text-sm font-semibold">
                                        {r.name}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        {r.guard_name}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-3 space-y-1 text-xs text-gray-500">
                                <p>
                                    {r.permissions?.length ?? 0} permisos
                                    asignados
                                </p>
                                <p>{r.users_count ?? 0} usuarios</p>
                            </div>

                            <div className="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                                <Link
                                    href={`/admin/administration/roles/${r.id}/edit`}
                                    className="flex-1 rounded-lg bg-[#001e38] px-4 py-2 text-center text-xs font-medium text-white hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38]"
                                >
                                    Gestionar permisos
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {!roles?.length && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-sm text-gray-500">
                            Sin roles configurados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
