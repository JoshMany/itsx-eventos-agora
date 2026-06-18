import { Head, useForm } from '@inertiajs/react';
import { Landmark, Moon, Sun } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { useAppearance } from '@/hooks/use-appearance';
import { useIsDark } from '@/hooks/use-is-dark';

type Props = { status?: string; canResetPassword: boolean };

export default function Login({ status }: Props) {
    const { data, setData, post, errors, processing, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const { updateAppearance } = useAppearance();
    const isDark = useIsDark();

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/login', { onSuccess: () => reset('password') });
    }

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="flex min-h-screen w-full">
                {/* ─── LEFT PANEL: Branding ─── */}
                <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[#001e38] p-10 lg:flex">
                    {/* Decorative orbs */}
                    <div
                        className="pointer-events-none absolute -top-32 -left-20 h-[520px] w-[520px] animate-[breathe_7s_ease-in-out_infinite] rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(220,195,85,0.18) 0%, rgba(0,30,56,0.5) 50%, transparent 72%)',
                        }}
                    />
                    <div
                        className="pointer-events-none absolute -right-16 -bottom-40 h-[400px] w-[400px] animate-[breathe_9s_ease-in-out_1.5s_infinite] rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,30,56,0.3) 55%, transparent 72%)',
                        }}
                    />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcc355] shadow-lg shadow-[#dcc355]/20">
                            <Landmark
                                size={22}
                                strokeWidth={1.8}
                                className="text-[#001e38]"
                            />
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight text-white">
                                AGORA
                            </span>
                            <p className="text-[0.65rem] leading-none tracking-wide text-[#dcc355]/70">
                                ITSX
                            </p>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="relative z-10 mt-auto mb-auto pt-16">
                        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#dcc355]/25 bg-[#dcc355]/10 px-3 py-1 text-[0.7rem] tracking-widest text-[#dcc355] uppercase">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#dcc355]" />
                            Portal Administrativo
                        </div>

                        <h1 className="mb-5 text-[clamp(2rem,3.2vw,2.6rem)] leading-[1.12] font-bold tracking-[-0.035em] text-white">
                            Gestiona tus eventos
                            <br />
                            con{' '}
                            <span
                                style={{
                                    backgroundImage:
                                        'linear-gradient(135deg, #dcc355 0%, #f5e6a3 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                excelencia.
                            </span>
                        </h1>

                        <p className="mb-10 max-w-[380px] text-[0.95rem] leading-relaxed text-white/60">
                            La plataforma institucional del Instituto
                            Tecnologico Superior de Xalapa para la gestion
                            integral de eventos, actividades, participantes y
                            certificaciones.
                        </p>

                        {/* Stats */}
                        <div className="mb-10 flex gap-8">
                            {[
                                { num: '270+', label: 'Participantes' },
                                { num: '3', label: 'Eventos activos' },
                                { num: '100+', label: 'Constancias' },
                            ].map(({ num, label }) => (
                                <div key={label}>
                                    <div className="text-[1.35rem] font-bold tracking-tight text-white">
                                        {num}
                                    </div>
                                    <div className="mt-0.5 text-[0.72rem] text-white/40">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div className="max-w-[400px] rounded-r-lg border-l-2 border-[#dcc355]/40 bg-white/[0.04] py-1 pl-4">
                            <p className="text-[0.85rem] leading-relaxed text-white/50 italic">
                                "AGORA transformo la manera en que organizamos
                                nuestros eventos academicos. La generacion de
                                constancias es impecable."
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dcc355] text-[0.65rem] font-bold text-[#001e38]">
                                    JM
                                </div>
                                <div>
                                    <div className="text-[0.78rem] font-medium text-white/80">
                                        Jose Munoz
                                    </div>
                                    <div className="text-[0.7rem] text-white/35">
                                        Coordinador Academico, ITSX
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="relative z-10 text-[0.7rem] text-white/30">
                        &copy; {new Date().getFullYear()} Instituto Tecnologico
                        Superior de Xalapa
                    </p>
                </div>

                {/* ─── RIGHT PANEL: Login Form ─── */}
                <div className="flex w-full max-w-[480px] flex-col justify-center border-l border-gray-200 bg-white px-8 py-12 lg:min-h-screen dark:border-gray-800 dark:bg-gray-950">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#001e38] dark:bg-[#dcc355]">
                            <Landmark
                                size={16}
                                className="text-white dark:text-[#001e38]"
                            />
                        </div>
                        <span className="font-bold tracking-tight text-[#001e38] dark:text-[#dcc355]">
                            AGORA
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-[1.45rem] font-bold tracking-tight text-gray-900 dark:text-white">
                            Iniciar Sesion
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                            Accede al portal administrativo de AGORA
                        </p>
                    </div>

                    {/* Dark mode toggle */}
                    <button
                        onClick={() =>
                            updateAppearance(isDark ? 'light' : 'dark')
                        }
                        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-label="Cambiar tema"
                    >
                        <span className="relative flex h-5 w-5 items-center justify-center">
                            <Sun
                                size={18}
                                className={`absolute transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
                            />
                            <Moon
                                size={18}
                                className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
                            />
                        </span>
                    </button>

                    {/* Status message */}
                    {status && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="flex flex-col gap-5">
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
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                autoComplete="username"
                                required
                                autoFocus
                                placeholder="admin@agora.test"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 hover:border-gray-400 focus:border-[#001e38] focus:ring-[3px] focus:ring-[#001e38]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:border-[#dcc355] dark:focus:ring-[#dcc355]/10"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <label htmlFor="password">Contraseña</label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e: any) =>
                                    setData('password', e.target?.value ?? e)
                                }
                            />
                            <div className="flex justify-end">
                                <a
                                    href="/forgot-password"
                                    className="text-xs text-[#001e38] hover:underline dark:text-[#dcc355]"
                                >
                                    ¿Olvidaste tu contrasena?
                                </a>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-[#001e38] focus:ring-[#001e38] dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Recordarme
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-1 w-full rounded-xl bg-[#001e38] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#001e38]/15 transition-all hover:bg-[#002d54] hover:shadow-[#001e38]/25 focus:ring-2 focus:ring-[#001e38] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38] dark:shadow-[#dcc355]/20 dark:hover:bg-[#c4a830] dark:focus:ring-[#dcc355]"
                        >
                            {processing
                                ? 'Iniciando sesion...'
                                : 'Iniciar Sesion'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                        ¿No tienes acceso? Solo los administradores autorizados
                        pueden ingresar.
                    </p>
                </div>
            </div>
        </>
    );
}
