import { Head, Link } from '@inertiajs/react';
import { Users, Shield, Settings, ScrollText } from 'lucide-react';

const icons: Record<string, React.ElementType> = {
    Usuarios: Users,
    Roles: Shield,
    Catálogos: Settings,
    Auditoría: ScrollText,
};

export default function AdministrationIndex({ sections }: any) {
    return (
        <div>
            <Head title="Administración" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Administración</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Configuración y gestión del sistema.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {(sections ?? []).map((s: any) => {
                        const Icon = icons[s.label] ?? Settings;

                        return (
                            <Link
                                key={s.label}
                                href={s.href}
                                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-[#001e38] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#dcc355]"
                            >
                                <Icon
                                    size={28}
                                    className="mb-3 text-gray-400 transition-colors group-hover:text-[#001e38] dark:group-hover:text-[#dcc355]"
                                />
                                <p className="text-foreground text-sm font-semibold">
                                    {s.label}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    {s.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
