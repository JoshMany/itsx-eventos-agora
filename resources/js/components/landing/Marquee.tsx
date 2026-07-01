import { Marquee as MarqueeComponent } from '@/components/shadcn-space/animations/marquee';

interface TickerStats {
    eventsThisYear: number;
    totalParticipants: number;
    totalCertificates: number;
    averageAttendance: number;
}

interface MarqueeProps {
    stats: TickerStats;
}

const ITEMS = [
    (s: TickerStats) =>
        `🎯 ${s.eventsThisYear} eventos organizados este año en el ITSX`,
    (s: TickerStats) =>
        `👥 ${s.totalParticipants.toLocaleString()}+ participantes han vivido la experiencia`,
    (s: TickerStats) =>
        `📊 ${s.averageAttendance}% de tasa de asistencia — ¡súmate!`,
    (s: TickerStats) =>
        `📜 ${s.totalCertificates.toLocaleString()}+ constancias emitidas con validez institucional`,
    (s: TickerStats) =>
        `🏛️ Formando comunidad a través de actividades académicas y culturales`,
    (s: TickerStats) =>
        `🚀 Tu participación impulsa la vida universitaria — sé parte del cambio`,
] as const;

export default function Marquee({ stats }: MarqueeProps) {
    if (!stats) return null;

    const labels = ITEMS.map((fn) => fn(stats));

    return (
        <section
            aria-label="Indicadores institucionales"
            className="relative flex w-full flex-col items-center justify-center overflow-hidden"
        >
            <MarqueeComponent
                pauseOnHover
                repeat={2}
                className="[--duration:60s]"
            >
                {labels.map((label) => (
                    <div className="flex items-center justify-center px-6">
                        <span className="text-lg font-bold text-foreground dark:text-itsx-gold">
                            {label}
                        </span>
                    </div>
                ))}
            </MarqueeComponent>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-linear-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-linear-to-l from-background"></div>
        </section>
    );
}
