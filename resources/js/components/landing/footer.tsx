import { Link } from '@inertiajs/react';
import { Landmark } from 'lucide-react';

const footerLinks = {
    plataforma: [
        { label: 'Eventos', href: '/eventos' },
        { label: 'Calendario', href: '/calendario' },
        { label: 'Constancias', href: '/constancias' },
    ],
    institución: [
        { label: 'ITSX', href: 'https://itsx.edu.mx' },
        { label: 'Acerca de', href: '/acerca' },
        { label: 'Contacto', href: '/acerca' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border" role="contentinfo">
            {/* Top accent bar */}
            <div className="h-1 bg-itsx-blue/60 dark:bg-itsx-gold/60" />

            <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
                <div className="grid gap-10 sm:grid-cols-3">
                    {/* Brand */}
                    <div className="sm:col-span-1">
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5 transition-all duration-200"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-itsx-blue text-white dark:bg-itsx-gold dark:text-itsx-blue">
                                <Landmark className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-semibold tracking-wide text-foreground group-hover:underline group-hover:decoration-itsx-blue group-hover:decoration-2 group-hover:underline-offset-4 dark:text-itsx-gold dark:group-hover:decoration-itsx-gold">
                                ÁGORA
                            </span>
                        </Link>
                        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
                            Plataforma Institucional de Eventos y Actividades
                            del Instituto Tecnológico Superior de Xalapa.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([categoria, links]) => (
                        <div key={categoria}>
                            <h3 className="text-sm font-semibold text-foreground capitalize">
                                {categoria}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground text-sm decoration-itsx-blue transition-all duration-200 ease-in-out hover:text-foreground hover:underline hover:decoration-2 hover:underline-offset-4 dark:decoration-itsx-gold"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="text-muted-foreground relative mt-12 pt-8 text-center text-xs">
                    {/* Subtle separator */}
                    <div className="absolute top-0 right-0 left-0 h-px bg-border" />

                    <p>
                        &copy; {new Date().getFullYear()} Instituto Tecnológico
                        Superior de Xalapa. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
