import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { store } from '@/actions/App/Http/Controllers/Auth/MagicLinkController';
import { home } from '@/routes';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

type Props = { status?: string };

export default function MagicLink({ status }: Props) {
    return (
        <>
            <Head title="Acceso" />
            <div className="flex min-h-svh flex-col bg-gray-50 dark:bg-gray-950">
                <div className="flex h-14 items-center justify-center border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <Link href={home()} className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#001e38] dark:bg-[#dcc355]">
                            <span className="text-sm font-bold text-white dark:text-[#001e38]">
                                A
                            </span>
                        </div>
                        <span className="text-sm font-bold tracking-tight text-[#001e38] dark:text-[#dcc355]">
                            AGORA
                        </span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center p-6">
                    <div className="w-full max-w-sm">
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#001e38]/5 dark:bg-[#dcc355]/10">
                                <Mail
                                    size={24}
                                    className="text-[#001e38] dark:text-[#dcc355]"
                                />
                            </div>
                            <div className="mb-8 space-y-2 text-center">
                                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    Accede a tu espacio personal
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Te enviaremos un enlace seguro a tu correo
                                    electronico. Sin contrasenas.
                                </p>
                            </div>
                            {status ? (
                                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-center dark:border-green-900 dark:bg-green-950">
                                    <ShieldCheck
                                        size={24}
                                        className="mx-auto mb-2 text-green-600 dark:text-green-400"
                                    />
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        {status}
                                    </p>
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        Revisa tu bandeja de entrada
                                    </p>
                                </div>
                            ) : (
                                <Form
                                    {...store.form()}
                                    className="flex flex-col gap-5"
                                >
                                    {({ errors }: any) => (
                                        <>
                                            <div className="grid gap-1.5">
                                                <label
                                                    htmlFor="email"
                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Correo electronico
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    autoComplete="email"
                                                    placeholder="tu@correo.com"
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm transition-colors outline-none focus:border-[#001e38] focus:ring-2 focus:ring-[#001e38]/10 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#001e38] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                                            >
                                                Enviar enlace de acceso{' '}
                                                <ArrowRight size={16} />
                                            </button>
                                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                                                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                                    No necesitas crear una
                                                    cuenta. Solo ingresa tu
                                                    correo y recibe un enlace
                                                    magico para acceder.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            )}
                        </div>
                        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                            <Link
                                href={home()}
                                className="underline hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                Explorar eventos sin iniciar sesion
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
