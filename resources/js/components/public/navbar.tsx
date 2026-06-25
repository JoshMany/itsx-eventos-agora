import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Landmark, Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { useAppearance } from '@/hooks/use-appearance';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

import { login, register } from '@/routes';
import { MobileDrawer } from './mobile-drawer';

const navLinks = [
    { href: '/eventos', label: 'Eventos' },
    { href: '/calendario', label: 'Calendario' },
    { href: '/constancias', label: 'Constancias' },
    { href: '/acerca', label: 'Acerca de' },
] as const;

export default function NavBar() {
    const { auth } = usePage().props;

    const { resolvedAppearance, updateAppearance } = useAppearance();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isDark = resolvedAppearance === 'dark';

    const scrollDirection = useScrollDirection();

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 z-40 w-full border-b border-itsx-blue bg-background/80 shadow-md backdrop-blur-sm transition-transform duration-300 dark:border-itsx-gold ${
                    scrollDirection === 'down' && !mobileOpen
                        ? '-translate-y-full'
                        : 'translate-y-0'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-itsx-blue text-white dark:bg-itsx-gold dark:text-itsx-blue">
                            <Landmark size={18} />
                        </div>

                        <span className="font-semibold dark:text-itsx-gold">
                            ÁGORA
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                                updateAppearance(isDark ? 'light' : 'dark')
                            }
                        >
                            {isDark ? <Moon size={18} /> : <Sun size={18} />}
                        </Button>

                        {!auth.user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.visit(login().url)}
                                >
                                    Iniciar sesión
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => router.visit(register().url)}
                                >
                                    Registrate
                                </Button>
                            </>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-foreground/80 hover:text-foreground"
                            >
                                Mi cuenta
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                                updateAppearance(isDark ? 'light' : 'dark')
                            }
                        >
                            {isDark ? <Moon size={18} /> : <Sun size={18} />}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={18} />
                        </Button>
                    </div>
                </div>
            </header>

            <MobileDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                auth={auth}
            />
        </>
    );
}
