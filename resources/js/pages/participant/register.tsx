import { Button, Input, Spinner } from '@heroui/react';
import { Head, useForm } from '@inertiajs/react';
import { store as registerRoute } from '@/actions/App/Http/Controllers/Participants/ParticipantRegistrationController';
import InputError from '@/components/input-error';

type ParticipantType = 'student' | 'staff' | 'external';

type Props = {
    eventId: number;
    eventName: string;
};

const participantTypes = [
    { key: 'student', label: 'Estudiante' },
    { key: 'staff', label: 'Personal institucional' },
    { key: 'external', label: 'Externo' },
] as const;

export default function RegisterForm({ eventId, eventName }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        type: '' as ParticipantType,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        institution: '',
        student_number: '',
        event_id: eventId,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(registerRoute().url);
    }

    return (
        <>
            <Head title={`Registrarme – ${eventName}`} />

            <div className="min-h-screen bg-background py-12">
                <div className="mx-auto max-w-lg px-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-foreground">
                            Registrarme
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {eventName}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="border-default-200 bg-content1 space-y-6 rounded-xl border p-6 shadow-sm"
                    >
                        <div className="grid gap-4">
                            {/* Participant type */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Tipo de participante{' '}
                                    <span className="text-danger">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData(
                                            'type',
                                            e.target.value as ParticipantType,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">Selecciona tu tipo</option>
                                    {participantTypes.map((t) => (
                                        <option key={t.key} value={t.key}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            {/* Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Nombre{' '}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.first_name}
                                        onValueChange={(v) =>
                                            setData('first_name', v)
                                        }
                                        placeholder="Nombre"
                                        autoComplete="given-name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Apellido{' '}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.last_name}
                                        onValueChange={(v) =>
                                            setData('last_name', v)
                                        }
                                        placeholder="Apellido"
                                        autoComplete="family-name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Correo electrónico{' '}
                                    <span className="text-danger">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onValueChange={(v) => setData('email', v)}
                                    placeholder="tu@correo.com"
                                    autoComplete="email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Phone */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Teléfono
                                </label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onValueChange={(v) => setData('phone', v)}
                                    placeholder="Opcional"
                                    autoComplete="tel"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            {/* Institution (shown for external) */}
                            {(data.type === 'external' ||
                                data.type === 'staff') && (
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Institución
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.institution}
                                        onValueChange={(v) =>
                                            setData('institution', v)
                                        }
                                        placeholder="Nombre de tu institución u organización"
                                    />
                                    <InputError message={errors.institution} />
                                </div>
                            )}

                            {/* Student number (shown for student) */}
                            {data.type === 'student' && (
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Número de control
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.student_number}
                                        onValueChange={(v) =>
                                            setData('student_number', v)
                                        }
                                        placeholder="Tu número de control"
                                    />
                                    <InputError
                                        message={errors.student_number}
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            color="primary"
                            className="w-full"
                            isDisabled={processing}
                            size="lg"
                        >
                            {processing && <Spinner size="sm" />}
                            Registrarme
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            Al registrarte aceptas recibir confirmaciones y
                            recordatorios por correo electrónico.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
