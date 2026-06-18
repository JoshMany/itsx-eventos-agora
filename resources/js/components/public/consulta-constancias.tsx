import { Button, Card, Input } from '@heroui/react';
import { router } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';

const benefits = [
    'Folio único',
    'Código QR verificable',
    'Validación en segundos',
];

export default function ConsultaConstancias() {
    return (
        <section
            aria-labelledby="constancias-heading"
            className="py-20 sm:py-28"
        >
            <div className="mx-auto max-w-3xl px-6 text-center sm:px-8 lg:px-10">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-itsx-gold/15 text-itsx-blue shadow-sm dark:bg-itsx-gold/15 dark:text-itsx-gold">
                        <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                    </div>
                </div>

                <h2
                    id="constancias-heading"
                    className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                >
                    Consulta de constancias
                </h2>
                <p className="text-muted-foreground mt-3">
                    Verifica la autenticidad de una constancia ingresando su
                    folio o código de validación.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-6">
                    {benefits.map((text) => (
                        <div
                            key={text}
                            className="text-muted-foreground flex items-center gap-2 text-sm"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-itsx-blue dark:bg-itsx-gold" />
                            {text}
                        </div>
                    ))}
                </div>

                <Card className="group bg-card relative mx-auto mt-8 max-w-md overflow-hidden rounded-xl border border-border/50 p-6 shadow-sm transition-all duration-250 hover:border-itsx-blue/30 hover:shadow-md dark:hover:border-itsx-gold/30">
                    {/* Top accent bar */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-itsx-blue dark:bg-itsx-gold" />

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            placeholder="Folio o código de validación"
                            className="flex-1"
                            aria-label="Folio de constancia"
                        />
                        <Button
                            onPress={() => router.visit('/constancias')}
                            className="bg-itsx-blue text-white shadow-sm transition-all duration-250 hover:bg-itsx-blue/90 hover:shadow-md active:scale-[0.97]"
                        >
                            <Search
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                            />
                            Verificar
                        </Button>
                    </div>
                </Card>
            </div>
        </section>
    );
}
