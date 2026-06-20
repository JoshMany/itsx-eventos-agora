import { Head, Link, useForm } from '@inertiajs/react';

export default function UsersEdit({ user, allRoles, assignedRoles }: any) {
    const { data, setData, patch, processing } = useForm({
        roles: assignedRoles ?? [],
    });

    const toggleRole = (id: number) => {
        const current = data.roles as number[];
        setData(
            'roles',
            current.includes(id)
                ? current.filter((r) => r !== id)
                : [...current, id],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/administration/users/${user.id}/roles`, {
            preserveScroll: true,
        });
    };

    return (
        <div>
            <Head title={`Roles: ${user.name}`} />
            <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Link
                                    href="/admin/administration"
                                    className="hover:text-gray-600"
                                >
                                    Administración
                                </Link>
                                <span>/</span>
                                <Link
                                    href="/admin/administration/users"
                                    className="hover:text-gray-600"
                                >
                                    Usuarios
                                </Link>
                                <span>/</span>
                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                    {user.name}
                                </span>
                            </div>
                            <h2 className="mt-1 text-lg font-semibold">
                                Asignar roles
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                        >
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex flex-wrap gap-3">
                            {(allRoles ?? []).map((r: any) => {
                                const checked = (
                                    data.roles as number[]
                                ).includes(r.id);
                                return (
                                    <label
                                        key={r.id}
                                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                            checked
                                                ? 'border-[#001e38] bg-[#001e38]/5 text-[#001e38] dark:border-[#dcc355] dark:bg-[#dcc355]/10 dark:text-[#dcc355]'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleRole(r.id)}
                                            className="sr-only"
                                        />
                                        {r.name}
                                    </label>
                                );
                            })}
                        </div>

                        {!allRoles?.length && (
                            <p className="text-sm text-gray-400">
                                No hay roles disponibles.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
