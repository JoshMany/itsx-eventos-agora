import { Head, Link } from '@inertiajs/react';

type ParticipantType = 'student' | 'staff' | 'external';
type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended';

type Participant = {
    uuid: string;
    type: ParticipantType;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    institution: string | null;
    student_number: string | null;
};

type Registration = {
    uuid: string;
    status: RegistrationStatus;
    registered_at: string;
    event?: {
        id: number;
        name: string;
        slug: string;
        starts_at: string;
    };
};

type Props = {
    participant: Participant;
    registrations: Registration[];
};

const statusLabels: Record<RegistrationStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    attended: 'Asistió',
};

const statusColors: Record<RegistrationStatus, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    confirmed:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    attended:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

const typeLabels: Record<ParticipantType, string> = {
    student: 'Estudiante',
    staff: 'Personal',
    external: 'Externo',
};

export default function ParticipantDashboard({
    participant,
    registrations,
}: Props) {
    const fullName =
        `${participant.first_name} ${participant.last_name}`.trim();

    return (
        <>
            <Head title="Mi espacio – ÁGORA" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-default-200 bg-content1 border-b">
                    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                    ÁGORA
                                </p>
                                <h1 className="mt-0.5 text-lg font-semibold text-foreground">
                                    Mi espacio
                                </h1>
                            </div>
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Explorar eventos
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
                    {/* Profile card */}
                    <section className="border-default-200 bg-content1 rounded-xl border p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001e38] text-lg font-semibold text-white">
                                {(fullName ||
                                    participant.email)[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                {fullName ? (
                                    <h2 className="font-semibold text-foreground">
                                        {fullName}
                                    </h2>
                                ) : null}
                                <p className="text-sm text-muted-foreground">
                                    {participant.email}
                                </p>
                                <span className="bg-default-100 text-default-700 mt-1 inline-block rounded-full px-2 py-0.5 text-xs">
                                    {typeLabels[participant.type]}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Registrations */}
                    <section>
                        <h2 className="mb-4 text-base font-semibold text-foreground">
                            Mis eventos
                        </h2>

                        {registrations.length === 0 ? (
                            <div className="border-default-200 bg-content1 rounded-xl border border-dashed p-12 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Todavía no te has registrado a ningún
                                    evento.
                                </p>
                                <Link
                                    href="/"
                                    className="mt-3 inline-block text-sm font-medium text-[#001e38] underline underline-offset-4 dark:text-[#dcc355]"
                                >
                                    Explorar eventos
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {registrations.map((reg) => (
                                    <li
                                        key={reg.uuid}
                                        className="border-default-200 bg-content1 flex items-center justify-between gap-4 rounded-xl border p-4 shadow-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">
                                                {reg.event?.name ?? 'Evento'}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Registrado el{' '}
                                                {new Date(
                                                    reg.registered_at,
                                                ).toLocaleDateString('es-MX', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[reg.status]}`}
                                        >
                                            {statusLabels[reg.status]}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
