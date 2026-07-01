import { Card } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

const features = [
    {
        icono: BookOpen,
        titulo: 'Descubre.',
        descripcion:
            'Explora eventos académicos, culturales, deportivos y tecnológicos del ITSX. Encuentra actividades que impulsen tu formación integral.',
        label: 'explorar()',
    },
    {
        icono: GraduationCap,
        titulo: 'Participa.',
        descripcion:
            'Regístrate en eventos, sigue tu agenda de actividades y acumula constancias de participación que validen tu trayectoria.',
        label: 'registrarse()',
    },
    {
        icono: ShieldCheck,
        titulo: 'Certifícate.',
        descripcion:
            'Obtén constancias oficiales con folio único y código QR. Verifica la autenticidad de cualquier documento en segundos.',
        label: 'verificar()',
    },
];

export default function Caracteristicas() {
    return (
        <section aria-labelledby="features-heading" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="mb-16 text-center">
                    <h2
                        id="features-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Todo lo que necesitas en un solo lugar.
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                        Desde descubrir hasta certificar tu participación, ÁGORA
                        te acompaña en cada etapa de tu vida universitaria.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                    {features.map(
                        ({ icono: Icon, titulo, descripcion, label }) => (
                            <div
                                key={titulo}
                                role="button"
                                tabIndex={0}
                                onClick={() => router.visit('/eventos')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        router.visit('/eventos');
                                    }
                                }}
                                className="group animate-on-scroll"
                            >
                                <Card className="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-250 hover:border-itsx-blue/30 hover:shadow-md sm:p-8 dark:hover:border-itsx-gold/30">
                                    {/* Top accent bar */}
                                    <div className="absolute top-0 right-0 left-0 h-1 bg-itsx-blue dark:bg-itsx-gold" />

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-itsx-blue/10 text-itsx-blue shadow-sm transition-all duration-250 group-hover:scale-110 group-hover:bg-itsx-blue group-hover:text-white dark:bg-itsx-gold/10 dark:text-itsx-gold dark:group-hover:bg-itsx-gold dark:group-hover:text-itsx-blue">
                                        <Icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-bold text-foreground">
                                            {titulo}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {descripcion}
                                        </p>
                                    </div>
                                    <span className="inline-flex self-start rounded-md border border-itsx-blue/20 bg-itsx-blue/5 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider text-itsx-blue transition-all duration-250 group-hover:border-itsx-blue/40 group-hover:bg-itsx-blue/10 dark:border-itsx-gold/20 dark:bg-itsx-gold/5 dark:text-itsx-gold dark:group-hover:border-itsx-gold/40 dark:group-hover:bg-itsx-gold/10">
                                        {label}
                                    </span>
                                </Card>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
