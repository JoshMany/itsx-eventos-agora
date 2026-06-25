import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    ChevronRight,
    ShieldCheck,
    Trophy,
    Users,
} from 'lucide-react';

interface UpcomingEvent {
    title: string;
    starts_at: string;
    ends_at: string;
    slug: string;
    available_spots: number | null;
    confirmed_count: number;
}

interface HeroStats {
    eventsThisYear: number;
    totalParticipants: number;
    totalCertificates: number;
    nextEvent: {
        title: string;
        starts_at: string;
        ends_at: string;
    } | null;
    upcomingEvents: UpcomingEvent[];
    averageAttendance: number;
}

interface HeroProps {
    stats: HeroStats;
}

const cardColors = [
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-sky-500',
    'bg-rose-500',
] as const;

const locale = 'es-MX';
const dateOptions = { day: 'numeric', month: 'short' } as const;

function formatShortDate(iso: string): string {
    return new Date(iso).toLocaleDateString(locale, dateOptions);
}

function formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const sd = s.toLocaleDateString(locale, dateOptions);
    const ed = e.toLocaleDateString(locale, dateOptions);

    return `${sd} — ${ed}`;
}

function spotsLabel(event: UpcomingEvent): string {
    if (event.available_spots !== null && event.available_spots > 0) {
        return `quedan ${event.available_spots} lugares`;
    }

    return `${event.confirmed_count} inscritos`;
}

function StatsSkeleton() {
    return (
        <div className="flex flex-wrap gap-8 pt-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted" />
                    <div className="space-y-1.5">
                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatsContent({ stats }: { stats: HeroStats }) {
    const items = [
        {
            value: stats.eventsThisYear,
            suffix: '+',
            label: 'Eventos este año',
            icon: Calendar,
        },
        {
            value: stats.totalParticipants.toLocaleString(),
            suffix: '+',
            label: 'Participantes',
            icon: Users,
        },
        {
            value: stats.totalCertificates.toLocaleString(),
            suffix: '+',
            label: 'Constancias',
            icon: Award,
        },
    ] as const;

    return (
        <div className="flex flex-wrap gap-8 pt-2">
            {items.map(({ value, suffix, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-itsx-gold/10 text-itsx-blue dark:text-itsx-gold">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-lg leading-none font-bold text-foreground">
                            {value}
                            {suffix}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Hero({ stats }: HeroProps) {
    return (
        <section
            aria-labelledby="hero-heading"
            className="relative h-screen overflow-hidden bg-background pt-16"
        >
            <div className="mx-auto h-full max-w-7xl items-center px-6 sm:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
                {/* LEFT — Mensaje principal */}
                <div className="flex flex-col gap-8">
                    <h1
                        id="hero-heading"
                        className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
                    >
                        El punto de encuentro para la vida universitaria.
                    </h1>

                    <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                        Descubre eventos académicos, actividades culturales,
                        talleres, conferencias y experiencias que impulsan tu
                        formación profesional dentro y fuera del aula.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <Button
                            size="lg"
                            onClick={() => router.visit('/eventos')}
                            className="bg-itsx-blue hover:bg-itsx-blue/90"
                        >
                            Explorar eventos
                            <ArrowRight aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.visit('/constancias')}
                            className="border-2 border-blue-950 text-itsx-blue hover:bg-itsx-blue hover:text-white dark:text-itsx-gold dark:hover:bg-itsx-gold dark:hover:text-itsx-blue"
                        >
                            Verificar constancia
                            <ChevronRight aria-hidden="true" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-2">
                        {[
                            {
                                icon: BookOpen,
                                label: 'Eventos institucionales',
                            },
                            { icon: Trophy, label: 'Actividades académicas' },
                            {
                                icon: ShieldCheck,
                                label: 'Constancias verificables',
                            },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 text-sm text-muted-foreground"
                            >
                                <Icon
                                    className="h-4 w-4 text-itsx-blue dark:text-itsx-gold"
                                    aria-hidden="true"
                                />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Trust stats */}
                    {!stats ? (
                        <StatsSkeleton />
                    ) : (
                        <StatsContent stats={stats} />
                    )}
                </div>

                {/* RIGHT — Visual preview (decorative) */}
                <div aria-hidden="true" className="relative hidden lg:block">
                    {/* Main card */}
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 dark:shadow-black/20">
                        {/* Card header */}
                        <div className="mb-5 flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-itsx-blue text-white">
                                <Calendar />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {stats?.nextEvent
                                        ? 'Próximo evento'
                                        : 'Próximos eventos'}
                                </p>
                                <p className="text-md text-muted-foreground">
                                    {stats?.nextEvent?.title ??
                                        'Semana Académica ITSX'}
                                </p>
                            </div>
                        </div>

                        {/* Date + location */}
                        {stats?.nextEvent && (
                            <div className="mb-5 flex items-center gap-4 rounded-lg bg-itsx-gold p-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-itsx-blue dark:text-itsx-blue" />
                                    <span className="font-medium text-foreground dark:text-itsx-blue">
                                        {formatDateRange(
                                            stats.nextEvent.starts_at,
                                            stats.nextEvent.ends_at,
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Mini event cards */}
                        <div className="space-y-2.5">
                            {!stats?.upcomingEvents?.length &&
                                [1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex animate-pulse items-center gap-3 rounded-lg border border-border/40 bg-background p-3"
                                    >
                                        <div className="h-8 w-1 shrink-0 rounded-full bg-muted" />
                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <div className="h-4 w-3/4 rounded bg-muted" />
                                            <div className="h-3 w-1/2 rounded bg-muted" />
                                        </div>
                                    </div>
                                ))}
                            {stats?.upcomingEvents?.map((event, idx) => (
                                <Link
                                    key={event.slug}
                                    href={`/eventos/${event.slug}`}
                                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div
                                        className={`h-8 w-1 shrink-0 rounded-full ${
                                            cardColors[idx % cardColors.length]
                                        }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {event.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatShortDate(event.starts_at)}
                                            {' · '}
                                            {spotsLabel(event)}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Floating stats card */}
                    <div className="absolute -bottom-20 -left-16 hidden rounded-xl border border-border/50 bg-background px-5 py-3.5 shadow-lg shadow-black/40 xl:block">
                        <p className="text-xs font-medium text-muted-foreground">
                            Asistencia promedio
                        </p>
                        <p className="mt-0.5 text-2xl font-bold text-itsx-blue dark:text-itsx-gold">
                            {stats?.averageAttendance ?? 89}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Este semestre
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
