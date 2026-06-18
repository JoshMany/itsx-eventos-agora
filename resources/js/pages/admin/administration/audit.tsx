import { Head } from '@inertiajs/react';

export default function AdministrationAudit() {
    return (
        <div>
            <Head title="Auditoría" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Auditoría</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Registro de actividad del sistema.
                    </p>
                </div>

                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">
                        Módulo de auditoría en desarrollo
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Próximamente: historial de cambios por usuario, logs de
                        acceso y más.
                    </p>
                </div>
            </div>
        </div>
    );
}
