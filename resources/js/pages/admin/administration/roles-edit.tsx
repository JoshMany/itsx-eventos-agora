import { Head, Link, useForm } from '@inertiajs/react';

const moduleLabels: Record<string, string> = {
    events: 'Eventos',
    activities: 'Actividades',
    participants: 'Participantes',
    registrations: 'Inscripciones',
    attendance: 'Asistencia',
    certificates: 'Constancias',
    surveys: 'Encuestas',
    sponsors: 'Patrocinadores',
    budgets: 'Presupuestos',
    reports: 'Reportes',
    administration: 'Administración',
};

const actionLabels: Record<string, string> = {
    view: 'Ver',
    create: 'Crear',
    update: 'Editar',
    delete: 'Eliminar',
    publish: 'Publicar',
    manage: 'Gestionar',
    checkin: 'Check-in',
    generate: 'Generar',
    'generate-bulk': 'Gen. Masiva',
    submit: 'Enviar',
    approve: 'Aprobar',
    export: 'Exportar',
    configure: 'Configurar',
};

export default function RolesEdit({
    role,
    permissionGroups,
    assignedPermissions,
}: any) {
    const { data, setData, patch, processing } = useForm({
        permissions: assignedPermissions ?? [],
    });

    const togglePermission = (id: number) => {
        const current = data.permissions as number[];
        setData(
            'permissions',
            current.includes(id)
                ? current.filter((p) => p !== id)
                : [...current, id],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/administration/roles/${role.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Permisos: ${role.name}`} />
            <form onSubmit={handleSubmit} className="pb-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Link
                                href="/admin/administration/roles"
                                className="hover:text-gray-600"
                            >
                                Roles
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                {role.name}
                            </span>
                        </div>
                        <h2 className="mt-1 text-lg font-semibold">
                            Gestionar permisos
                        </h2>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                    >
                        {processing ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

                <div className="space-y-4">
                    {Object.entries(permissionGroups ?? {}).map(
                        ([module, perms]: [string, any]) => (
                            <div
                                key={module}
                                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <h3 className="text-foreground mb-3 text-sm font-semibold capitalize">
                                    {moduleLabels[module] ?? module}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {perms.map((p: any) => {
                                        const checked = (
                                            data.permissions as number[]
                                        ).includes(p.id);
                                        const action =
                                            p.name
                                                .split('.')
                                                .slice(1)
                                                .join('.') || p.name;

                                        return (
                                            <label
                                                key={p.id}
                                                className={`relative flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                                    checked
                                                        ? 'border-[#001e38] bg-[#001e38]/5 text-[#001e38] dark:border-[#dcc355] dark:bg-[#dcc355]/10 dark:text-[#dcc355]'
                                                        : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        togglePermission(p.id)
                                                    }
                                                    className="sr-only"
                                                />
                                                {actionLabels[action] ?? action}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </form>
        </>
    );
}
