import { Button, Card, Input } from '@heroui/react';
import { router, usePage } from '@inertiajs/react';
import { Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function ValidateCertificate() {
    const { folio } = usePage().props;
    const [searchFolio, setSearchFolio] = useState(folio ?? '');

    return (
        <section className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-itsx-gold/15 text-itsx-blue dark:bg-itsx-gold/15 dark:text-itsx-gold">
                        <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Validar constancia
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Ingresa el folio de la constancia para verificar su
                    autenticidad.
                </p>

                <Card className="mx-auto mt-8 max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            value={searchFolio}
                            onChange={(e) => setSearchFolio(e.target.value)}
                            placeholder="CON-2026-000001"
                            className="flex-1 font-mono"
                            aria-label="Folio de constancia"
                        />
                        <Button
                            onPress={() =>
                                router.get(
                                    `/constancias/validar/${searchFolio}`,
                                )
                            }
                            className="bg-itsx-blue text-white shadow-sm transition-all duration-200 hover:bg-itsx-blue/90"
                        >
                            <Search
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                            />
                            Validar
                        </Button>
                    </div>
                </Card>
            </div>
        </section>
    );
}
