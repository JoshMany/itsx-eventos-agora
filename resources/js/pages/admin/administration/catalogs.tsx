import { Head } from '@inertiajs/react';

export default function AdministrationCatalogs() {
    return (
        <div>
            <Head title="Catálogos" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Catálogos</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Configuración general del sistema (tipos de actividad,
                        salas, categorías de presupuesto, etc.)
                    </p>
                </div>

                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">
                        Módulo de catálogos en desarrollo
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Próximamente: gestión de tipos de actividad, salas y
                        más.
                    </p>
                </div>
            </div>
        </div>
    );
}
