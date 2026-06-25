import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">Nombre(s)</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="Ana"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Apellidos</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                placeholder="García"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ana@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="228 123 4567"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="organization">Organización</Label>
                            <Input
                                id="organization"
                                value={data.organization}
                                onChange={(e) =>
                                    setData('organization', e.target.value)
                                }
                                placeholder="ITSX"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="position">
                                Cargo / Especialidad
                            </Label>
                            <Input
                                id="position"
                                value={data.position}
                                onChange={(e) =>
                                    setData('position', e.target.value)
                                }
                                placeholder="Dra. en Ciencias"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="photo_url">URL de foto</Label>
                        <Input
                            id="photo_url"
                            type="url"
                            value={data.photo_url}
                            onChange={(e) =>
                                setData('photo_url', e.target.value)
                            }
                            placeholder="https://example.com/foto.jpg"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="social_links">
                            Redes sociales / Sitio web
                        </Label>
                        <Input
                            id="social_links"
                            type="url"
                            value={data.social_links}
                            onChange={(e) =>
                                setData('social_links', e.target.value)
                            }
                            placeholder="https://linkedin.com/in/ana-garcia"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder="Breve semblanza del ponente..."
                            className="h-24"
                        />
                    </div>

                    {eventActivities.length > 0 && (
                        <div className="grid gap-2">
                            <Label>Actividades asignadas</Label>
                            <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
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

                    <div className="flex items-center justify-end gap-2 border-t pt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
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
