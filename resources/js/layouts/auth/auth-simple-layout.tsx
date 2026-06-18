import { Link } from "@inertiajs/react";
import { Landmark } from "lucide-react";
import { home } from "@/routes";
import type { AuthLayoutProps } from "@/types";

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col bg-gray-50 dark:bg-gray-950">
            {/* Top bar - subtle branding */}
            <div className="flex h-14 items-center justify-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <Link href={home()} className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#001e38] dark:bg-[#dcc355]">
                        <Landmark size={18} className="text-white dark:text-[#001e38]" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-[#001e38] dark:text-[#dcc355]">AGORA</span>
                </Link>
            </div>

            {/* Main content */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
                        {/* Header */}
                        <div className="mb-8 space-y-2 text-center">
                            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                        Plataforma Institucional de Eventos<br />
                        Instituto Tecnologico Superior de Xalapa
                    </p>
                </div>
            </div>
        </div>
    );
}