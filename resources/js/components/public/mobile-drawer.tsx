import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { login, register } from '@/routes';

const navLinks = [
    { href: '/eventos', label: 'Eventos' },
    { href: '/calendario', label: 'Calendario' },
    { href: '/constancias', label: 'Constancias' },
    { href: '/acerca', label: 'Acerca de' },
] as const;

interface Props {
    open: boolean;
    onClose: () => void;
    auth: any;
}

export function MobileDrawer({ open, onClose, auth }: Props) {
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (typeof window === 'undefined') {
        return null;
    }

    return createPortal(
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                } `}
            />

            <aside
                className={`fixed top-0 right-0 z-[110] h-dvh w-[320px] max-w-[85vw] bg-background shadow-2xl transition-transform duration-300 ease-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                } `}
            >
                <div className="flex h-16 items-center justify-end border-b px-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={18} />
                    </Button>
                </div>

                <nav className="flex flex-col p-4">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className="hover:bg-default-100 rounded-lg px-4 py-3 text-base font-medium"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {!auth.user && (
                    <div className="mt-auto border-t p-4">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    onClose();
                                    router.visit(login().url);
                                }}
                            >
                                Iniciar sesión
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => {
                                    onClose();
                                    router.visit(register().url);
                                }}
                            >
                                Registrate
                            </Button>
                        </div>
                    </div>
                )}
            </aside>
        </>,
        document.body,
    );
}
