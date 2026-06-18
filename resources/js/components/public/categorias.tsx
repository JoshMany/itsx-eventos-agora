import { Card } from '@heroui/react';
import { router } from '@inertiajs/react';
import {
    BookOpen,
    Code,
    Dumbbell,
    FlaskConical,
    Music,
    Palette,
} from 'lucide-react';

const categorias = [
    {
        nombre: 'Académico',
        icono: BookOpen,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
        nombre: 'Tecnología',
        icono: Code,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
    },
    {
        nombre: 'Deportivo',
        icono: Dumbbell,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
        nombre: 'Cultural',
        icono: Palette,
        color: 'text-pink-600 dark:text-pink-400',
        bg: 'bg-pink-50 dark:bg-pink-950/40',
    },
    {
        nombre: 'Científico',
        icono: FlaskConical,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
        nombre: 'Artístico',
        icono: Music,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
];

export default function Categorias() {
    return (
        <section
            aria-labelledby="categorias-heading"
            className="py-20 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                <div className="mb-12">
                    <h2
                        id="categorias-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Categorías
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Explora eventos por área de interés.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categorias.map((cat) => {
                        const Icon = cat.icono;

                        return (
                            <div
                                key={cat.nombre}
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
                                <Card className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-5 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} ${cat.color}`}
                                    >
                                        <Icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {cat.nombre}
                                    </span>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
