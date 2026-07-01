import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Easing, motion } from 'motion/react';
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

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut' as Easing,
            delay: 0.1 * i,
        },
    }),
};

const rightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' as Easing, delay: 0.3 },
    },
};

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
        <motion.div
            className="flex flex-wrap gap-8 pt-2"
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.6 },
                },
            }}
        >
            {items.map(({ value, suffix, label, icon: Icon }) => (
                <motion.div
                    key={label}
                    className="flex items-center gap-3"
                    variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                    <motion.div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-itsx-gold/10 text-itsx-blue dark:text-itsx-gold"
                        whileHover={{ scale: 1.1, rotate: -4 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 14,
                        }}
                    >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </motion.div>
                    <div>
                        <p className="text-lg leading-none font-bold text-foreground">
                            {value}
                            {suffix}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

const featureItems = [
    { icon: BookOpen, label: 'Eventos institucionales' },
    { icon: Trophy, label: 'Actividades académicas' },
    { icon: ShieldCheck, label: 'Constancias verificables' },
];

function FeatureItem({
    icon: Icon,
    label,
    index,
}: {
    icon: typeof BookOpen;
    label: string;
    index: number;
}) {
    return (
        <motion.div
            className="group flex items-center gap-2.5 text-sm text-muted-foreground"
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                whileHover={{ scale: 1.15, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            >
                <Icon
                    className="h-4 w-4 text-itsx-blue transition-colors duration-200 group-hover:text-itsx-gold dark:text-itsx-gold dark:group-hover:text-itsx-blue"
                    aria-hidden="true"
                />
            </motion.div>
            <span>{label}</span>
        </motion.div>
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
                    <motion.h1
                        id="hero-heading"
                        className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                            delay: 0.15,
                        }}
                    >
                        El punto de encuentro para la vida universitaria.
                    </motion.h1>

                    <motion.p
                        className="max-w-lg text-lg leading-relaxed text-muted-foreground"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: 'easeOut',
                            delay: 0.3,
                        }}
                    >
                        Descubre eventos académicos, actividades culturales,
                        talleres, conferencias y experiencias que impulsan tu
                        formación profesional dentro y fuera del aula.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: 'easeOut',
                            delay: 0.45,
                        }}
                    >
                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            <Button
                                size="lg"
                                onClick={() => router.visit('/eventos')}
                                className="bg-itsx-blue shadow-sm shadow-itsx-blue/20 transition-shadow duration-200 hover:bg-itsx-blue/90 hover:shadow-md hover:shadow-itsx-blue/30"
                            >
                                Explorar eventos
                                <motion.span
                                    className="inline-flex"
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <ArrowRight aria-hidden="true" />
                                </motion.span>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.visit('/constancias')}
                                className="border-2 border-blue-950 text-itsx-blue transition-all duration-200 hover:bg-itsx-blue hover:text-white dark:border-itsx-gold/40 dark:text-itsx-gold dark:hover:bg-itsx-gold dark:hover:text-itsx-blue"
                            >
                                Verificar constancia
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap gap-6 pt-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.55,
                                },
                            },
                        }}
                    >
                        {featureItems.map((item, index) => (
                            <FeatureItem
                                key={item.label}
                                {...item}
                                index={index}
                            />
                        ))}
                    </motion.div>

                    {/* Trust stats */}
                    {!stats ? (
                        <StatsSkeleton />
                    ) : (
                        <StatsContent stats={stats} />
                    )}
                </div>

                {/* RIGHT — Visual preview (decorative) */}
                <motion.div
                    aria-hidden="true"
                    className="relative hidden lg:block"
                    variants={rightVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Main card */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 dark:shadow-black/20"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Card header */}
                        <div className="mb-5 flex items-center gap-2.5">
                            <motion.div
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-itsx-blue text-white"
                                whileHover={{ rotate: -8, scale: 1.05 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 250,
                                    damping: 12,
                                }}
                            >
                                <Calendar />
                            </motion.div>
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
                            <motion.div
                                className="mb-5 flex items-center gap-4 rounded-lg bg-itsx-gold p-3 text-sm"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.5 }}
                            >
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-itsx-blue dark:text-itsx-blue" />
                                    <span className="font-medium text-foreground dark:text-itsx-blue">
                                        {formatDateRange(
                                            stats.nextEvent.starts_at,
                                            stats.nextEvent.ends_at,
                                        )}
                                    </span>
                                </div>
                            </motion.div>
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
                                <motion.div
                                    key={event.slug}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.6 + 0.1 * idx,
                                        ease: 'easeOut',
                                    }}
                                    whileHover={{
                                        x: 4,
                                        transition: { duration: 0.15 },
                                    }}
                                >
                                    <Link
                                        href={`/eventos/${event.slug}`}
                                        className="flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <motion.div
                                            className={`h-8 w-1 shrink-0 rounded-full ${
                                                cardColors[
                                                    idx % cardColors.length
                                                ]
                                            }`}
                                            whileHover={{ scaleY: 1.3 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 250,
                                                damping: 12,
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-foreground">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatShortDate(
                                                    event.starts_at,
                                                )}
                                                {' · '}
                                                {spotsLabel(event)}
                                            </p>
                                        </div>
                                        <motion.div
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Floating stats card */}
                    <motion.div
                        className="absolute -bottom-20 -left-16 hidden rounded-xl border border-border/50 bg-background px-5 py-3.5 shadow-lg shadow-black/40 xl:block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.9,
                            ease: 'easeOut',
                        }}
                        whileHover={{ y: -3 }}
                    >
                        <p className="text-xs font-medium text-muted-foreground">
                            Asistencia promedio
                        </p>
                        <p className="mt-0.5 text-2xl font-bold text-itsx-blue dark:text-itsx-gold">
                            {stats?.averageAttendance ?? 89}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Este semestre
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
