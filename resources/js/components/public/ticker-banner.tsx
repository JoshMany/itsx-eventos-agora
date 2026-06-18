interface TickerStats {
    eventsThisYear: number;
    totalParticipants: number;
    totalCertificates: number;
    averageAttendance: number;
}

interface TickerBannerProps {
    stats: TickerStats;
}

export default function TickerBanner({ stats }: TickerBannerProps) {
    const items = [
        `${stats?.eventsThisYear ?? 24} eventos este año`,
        `${(stats?.totalParticipants ?? 1200).toLocaleString()}+ participantes`,
        `${stats?.averageAttendance ?? 89}% tasa de asistencia`,
        `${(stats?.totalCertificates ?? 500).toLocaleString()}+ constancias emitidas`,
    ];

    const tickerContent = [...items, ...items];

    return (
        <section
            aria-label="Indicadores institucionales"
            className="relative overflow-hidden border-y border-itsx-gold/20 bg-itsx-blue"
        >
            {/* Gradientes */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-itsx-blue via-itsx-blue/80 to-transparent md:w-20"
                aria-hidden="true"
            />

            <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-itsx-blue via-itsx-blue/80 to-transparent md:w-20"
                aria-hidden="true"
            />

            {/* Contenido */}
            <div className="flex h-12 items-center md:h-14">
                <div className="flex animate-marquee gap-8 whitespace-nowrap md:gap-14">
                    {tickerContent.map((text, index) => (
                        <div
                            key={index}
                            className="flex shrink-0 items-center gap-3"
                        >
                            <span className="h-2 w-2 rounded-full bg-itsx-gold/70" />

                            <span className="text-xs font-medium tracking-wide text-itsx-gold md:text-sm">
                                {text}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    className="flex animate-marquee gap-8 whitespace-nowrap md:gap-14"
                    aria-hidden="true"
                >
                    {tickerContent.map((text, index) => (
                        <div
                            key={`dup-${index}`}
                            className="flex shrink-0 items-center gap-3"
                        >
                            <span className="h-2 w-2 rounded-full bg-itsx-gold/70" />

                            <span className="text-xs font-medium tracking-wide text-itsx-gold md:text-sm">
                                {text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
