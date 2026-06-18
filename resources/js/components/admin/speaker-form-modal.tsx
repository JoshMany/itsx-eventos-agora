import { Button, Input, Label, TextArea, TextField } from '@heroui/react';
import { useForm } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import React from 'react';

interface SpeakerFormModalProps {
    eventUuid: string;
    speaker?: {
        uuid: string;
        first_name: string;
        last_name: string;
        email: string | null;
        phone: string | null;
        organization: string | null;
        position: string | null;
        bio: string | null;
        photo_url: string | null;
        social_links: string | null;
        activity_ids?: number[];
    } | null;
    eventActivities: { id: number; title: string }[];
    onClose: () => void;
}

export default function SpeakerFormModal({
    eventUuid,
    speaker,
    eventActivities,
    onClose,
}: SpeakerFormModalProps) {
    const isEdit = !!speaker;
    const { data, setData, post, put, processing } = useForm({
        first_name: speaker?.first_name ?? '',
        last_name: speaker?.last_name ?? '',
        email: speaker?.email ?? '',
        phone: speaker?.phone ?? '',
        organization: speaker?.organization ?? '',
        position: speaker?.position ?? '',
        bio: speaker?.bio ?? '',
        photo_url: speaker?.photo_url ?? '',
        social_links: speaker?.social_links ?? '',
        activity_ids: speaker?.activity_ids ?? [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/events/${eventUuid}/speakers/${speaker!.uuid}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        } else {
            post(`/admin/events/${eventUuid}/speakers`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: onClose,
            });
        }
    };

    const toggleActivity = (id: number) => {
        const current = data.activity_ids;
        if (current.includes(id)) {
            setData(
                'activity_ids',
                current.filter((a) => a !== id),
            );
        } else {
            setData('activity_ids', [...current, id]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <h2 className="text-sm font-semibold">
                        {isEdit ? 'Editar Ponente' : 'Registrar Ponente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-5">
                    <div className="grid grid-cols-2 gap-3">
                        <TextField
                            className="w-full"
                            name="first_name"
                            isRequired
                        >
                            <Label>Nombre(s)</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="Ana"
                            />
                        </TextField>
                        <TextField
                            className="w-full"
                            name="last_name"
                            isRequired
                        >
                            <Label>Apellidos</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                placeholder="García"
                            />
                        </TextField>
                    </div>
                    <TextField className="w-full" name="email">
                        <Label>Correo electrónico</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ana@example.com"
                        />
                    </TextField>
                    <TextField className="w-full" name="phone">
                        <Label>Teléfono</Label>
                        <Input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="228 123 4567"
                        />
                    </TextField>
                    <div className="grid grid-cols-2 gap-3">
                        <TextField className="w-full" name="organization">
                            <Label>Organización</Label>
                            <Input
                                value={data.organization}
                                onChange={(e) =>
                                    setData('organization', e.target.value)
                                }
                                placeholder="ITSX"
                            />
                        </TextField>
                        <TextField className="w-full" name="position">
                            <Label>Cargo / Especialidad</Label>
                            <Input
                                value={data.position}
                                onChange={(e) =>
                                    setData('position', e.target.value)
                                }
                                placeholder="Dra. en Ciencias"
                            />
                        </TextField>
                    </div>
                    <TextField className="w-full" name="photo_url">
                        <Label>URL de foto</Label>
                        <Input
                            type="url"
                            value={data.photo_url}
                            onChange={(e) =>
                                setData('photo_url', e.target.value)
                            }
                            placeholder="https://example.com/foto.jpg"
                        />
                    </TextField>
                    <TextField className="w-full" name="social_links">
                        <Label>Redes sociales / Sitio web</Label>
                        <Input
                            type="url"
                            value={data.social_links}
                            onChange={(e) =>
                                setData('social_links', e.target.value)
                            }
                            placeholder="https://linkedin.com/in/ana-garcia"
                        />
                    </TextField>
                    <TextField className="w-full" name="bio">
                        <Label>Biografía</Label>
                        <TextArea
                            aria-label="Bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder="Breve semblanza del ponente..."
                            className="h-24"
                        />
                    </TextField>

                    {eventActivities.length > 0 && (
                        <div>
                            <Label>Actividades asignadas</Label>
                            <div className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                                {eventActivities.map((act) => (
                                    <label
                                        key={act.id}
                                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.activity_ids.includes(
                                                act.id,
                                            )}
                                            onChange={() =>
                                                toggleActivity(act.id)
                                            }
                                            className="rounded border-gray-300 text-[#001e38] focus:ring-[#001e38] dark:border-gray-600"
                                        />
                                        {act.title}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <Button variant="tertiary" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={processing}
                            variant="primary"
                        >
                            {processing ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : null}
                            {isEdit ? 'Actualizar' : 'Registrar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
