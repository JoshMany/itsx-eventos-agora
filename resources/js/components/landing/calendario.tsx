import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface UpcomingEvent {
    title: string;
    starts_at: string;
    ends_at: string;
    slug: string;
    category: string;
}

interface CalendarioProps {
    upcomingEvents: UpcomingEvent[];
}

const locale = 'es-MX';

function formatDay(iso: string): string {
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit' });
}

function formatMonth(iso: string): string {
    return new Date(iso)
        .toLocaleDateString(locale, { month: 'short' })
        .replace('.', '');
}

function RowSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-4 rounded-xl border border-border/50 bg-card p-4 sm:gap-6 sm:p-5">
            <div className="h-14 w-14 shrink-0 rounded-lg bg-muted sm:h-16 sm:w-16" />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
            </div>
        </div>
    );
}

export default function Calendario({ upcomingEvents }: CalendarioProps) {
    return (
        <section
            aria-labelledby="calendario-heading"
            className="py-20 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            id="calendario-heading"
                            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                        >
                            Calendario
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Fechas clave del calendario institucional.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/calendario')}
                        className="text-itsx-blue dark:text-itsx-gold"
                    >
                        Calendario completo
                        <ChevronRight
                            className="ml-1 h-4 w-4"
                            aria-hidden="true"
                        />
                    </Button>
                </div>

                {!upcomingEvents ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <RowSkeleton key={i} />
                        ))}
                    </div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <p className="text-lg font-medium text-foreground">
                            No hay eventos próximos
                        </p>
                        <p className="text-sm text-muted-foreground">
                            El calendario se actualizará cuando haya nuevas
                            actividades programadas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingEvents.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/eventos/${item.slug}`}
                                className="block outline-none"
                            >
                                <Card className="group relative flex flex-row items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-250 hover:border-itsx-blue/30 hover:shadow-md sm:gap-6 sm:p-5 dark:hover:border-itsx-gold/30">
                                    {/* Left accent bar */}
                                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-itsx-blue dark:bg-itsx-gold" />

                                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-itsx-blue/10 text-itsx-blue shadow-sm transition-all duration-250 group-hover:bg-itsx-blue group-hover:text-white sm:h-16 sm:w-16 dark:bg-itsx-gold/10 dark:text-itsx-gold dark:group-hover:bg-itsx-gold dark:group-hover:text-itsx-blue">
                                        <span className="text-lg leading-none font-bold sm:text-xl">
                                            {formatDay(item.starts_at)}
                                        </span>
                                        <span className="text-[10px] leading-none font-medium uppercase opacity-80 sm:text-xs">
                                            {formatMonth(item.starts_at)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-semibold text-foreground sm:text-lg">
                                            {item.title}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Badge variant="outline">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30 transition-all duration-250 group-hover:translate-x-0.5 group-hover:text-itsx-blue dark:group-hover:text-itsx-gold" />
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
