import { Card } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Camera } from 'lucide-react';

const imagenes = [
    {
        id: 1,
        titulo: 'Semana Académica',
        alt: 'Estudiantes en conferencia académica',
    },
    {
        id: 2,
        titulo: 'Torneo Deportivo',
        alt: 'Equipos en competencia deportiva',
    },
    {
        id: 3,
        titulo: 'Feria Tecnológica',
        alt: 'Exposición de proyectos tecnológicos',
    },
    {
        id: 4,
        titulo: 'Festival Cultural',
        alt: 'Presentación cultural estudiantil',
    },
    {
        id: 5,
        titulo: 'Ceremonia de Premiación',
        alt: 'Entrega de reconocimientos',
    },
    { id: 6, titulo: 'Taller de Ciencias', alt: 'Estudiantes en laboratorio' },
];

export default function Galeria() {
    return (
        <section aria-labelledby="galeria-heading" className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="mb-12">
                    <h2
                        id="galeria-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Galería
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Momentos destacados de nuestros eventos.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
                    {imagenes.map((img) => (
                        <div
                            key={img.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => router.visit('/eventos')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    router.visit('/eventos');
                                }
                            }}
                        >
                            <Card className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 shadow-sm transition-all duration-250 hover:border-itsx-blue/30 hover:shadow-md dark:hover:border-itsx-gold/30">
                                {/* Top accent bar */}
                                <div className="absolute top-0 right-0 left-0 z-10 h-1 bg-itsx-blue/60 dark:bg-itsx-gold/60" />

                                {/* Placeholder */}
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-muted-foreground/10 bg-background/40 shadow-sm backdrop-blur-sm transition-all duration-250 group-hover:scale-110 group-hover:border-itsx-blue/20 dark:group-hover:border-itsx-gold/20">
                                        <Camera className="h-5 w-5 text-muted-foreground/40 transition-all duration-250 group-hover:text-itsx-blue dark:group-hover:text-itsx-gold" />
                                    </div>
                                </div>

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-itsx-blue/80 via-itsx-blue/5 to-transparent p-4 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
                                    <p className="text-sm font-medium text-white">
                                        {img.titulo}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
