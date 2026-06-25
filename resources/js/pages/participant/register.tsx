import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
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
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
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
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
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
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
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
                                        onChange={(e) =>
                                            setData(
                                                'institution',
                                                e.target.value,
                                            )
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
                                        onChange={(e) =>
                                            setData(
                                                'student_number',
                                                e.target.value,
                                            )
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
                            className="w-full"
                            disabled={processing}
                            size="lg"
                        >
                            {processing && <Spinner />}
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
