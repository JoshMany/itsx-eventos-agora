import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { useAppearance } from '@/hooks/use-appearance';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

import { login, register } from '@/routes';
import { MobileDrawer } from './mobile-drawer';
import AppLogo from '../AppLogo';

const navLinks = [
    { href: '/eventos', label: 'Eventos' },
    { href: '/calendario', label: 'Calendario' },
    { href: '/constancias', label: 'Constancias' },
    { href: '/acerca', label: 'Acerca de' },
] as const;

export default function NavBar() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
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
                    <div className="flex flex-row gap-5">
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                            onClick={(e) => {
                                if (currentUrl === '/') {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <AppLogo />
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group text-md relative font-bold"
                                    onClick={(e) => {
                                        if (currentUrl === href) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    {label}
                                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-itsx-gold transition-all duration-200 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <Button
                            onClick={() =>
                                updateAppearance(isDark ? 'light' : 'dark')
                            }
                        >
                            <motion.span
                                className="relative flex h-5 w-5 items-center justify-center"
                                whileHover={{ rotate: 30, scale: 1.15 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 250,
                                    damping: 12,
                                }}
                            >
                                <Sun
                                    size={18}
                                    className={`absolute transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
                                />
                                <Moon
                                    size={18}
                                    className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
                                />
                            </motion.span>
                        </Button>

                        {!auth.user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    className={'text-md font-bold'}
                                    onClick={() => router.visit(login().url)}
                                >
                                    Iniciar sesión
                                </Button>

                                <Button
                                    variant="outline"
                                    className={'text-md font-bold'}
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
                            <motion.span
                                className="relative flex h-5 w-5 items-center justify-center"
                                whileHover={{ rotate: 30, scale: 1.15 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 250,
                                    damping: 12,
                                }}
                            >
                                <Sun
                                    size={18}
                                    className={`absolute transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
                                />
                                <Moon
                                    size={18}
                                    className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
                                />
                            </motion.span>
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
