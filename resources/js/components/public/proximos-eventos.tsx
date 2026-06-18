import { Button, Card, Chip, ProgressBar } from '@heroui/react';
import { Link, router } from '@inertiajs/react';
import { MapPin, ArrowRight } from 'lucide-react';

interface UpcomingEvent {
    title: string;
    starts_at: string;
    ends_at: string;
    slug: string;
    available_spots: number | null;
    confirmed_count: number;
    capacity: number | null;
    location: string;
    category: string;
}

interface ProximosEventosProps {
    upcomingEvents: UpcomingEvent[];
}

const locale = 'es-MX';

function formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);

    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
        const day = s.toLocaleDateString(locale, { day: 'numeric' });
        const endPart = e.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        return `${day} — ${endPart}`;
    }

    return `${s.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} — ${e.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function CardSkeleton() {
    return (
        <Card className="bg-card flex animate-pulse flex-col gap-4 rounded-xl border border-border/50 p-5">
            <div className="flex items-start justify-between">
                <div className="h-5 w-20 rounded-full bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
            </div>
            <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
            <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted" />
            </div>
        </Card>
    );
}

export default function ProximosEventos({
    upcomingEvents,
}: ProximosEventosProps) {
    return (
        <section aria-labelledby="eventos-heading" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            id="eventos-heading"
                            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                        >
                            Próximos eventos
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Descubre y regístrate en los eventos del ITSX.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => router.visit('/eventos')}
                        className="text-itsx-blue dark:text-itsx-gold"
                    >
                        Ver todos
                        <ArrowRight
                            className="ml-1 h-4 w-4"
                            aria-hidden="true"
                        />
                    </Button>
                </div>

                {!upcomingEvents ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <p className="text-lg font-medium text-foreground">
                            No hay eventos próximos
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Vuelve más tarde para descubrir nuevas actividades.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((evento) => {
                            const registros = evento.confirmed_count;
                            const capacidad = evento.capacity ?? 0;
                            const progressValue =
                                capacidad > 0
                                    ? (registros / capacidad) * 100
                                    : 0;

                            return (
                                <Link
                                    key={evento.slug}
                                    href={`/eventos/${evento.slug}`}
                                    className="block outline-none"
                                >
                                    <Card className="bg-card flex flex-col gap-4 rounded-xl border border-border/50 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-2">
                                            <Chip size="sm" variant="tertiary">
                                                {evento.category}
                                            </Chip>
                                            <span className="text-muted-foreground shrink-0 text-xs">
                                                {formatDateRange(
                                                    evento.starts_at,
                                                    evento.ends_at,
                                                )}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {evento.title}
                                            </h3>
                                            <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {evento.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Registros
                                                </span>
                                                <span className="font-semibold text-foreground tabular-nums">
                                                    {registros.toLocaleString()}
                                                    {capacidad > 0 &&
                                                        ` / ${capacidad.toLocaleString()}`}
                                                </span>
                                            </div>
                                            {capacidad > 0 && (
                                                <ProgressBar
                                                    value={progressValue}
                                                    size="sm"
                                                />
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
