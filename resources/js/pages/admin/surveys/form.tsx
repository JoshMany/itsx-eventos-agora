import { Head, router, useForm } from '@inertiajs/react';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface QuestionItem {
    id?: number;
    question_type: string;
    question: string;
    sort_order: number;
    options: { id?: number; label: string; value: string }[];
    _key: string; // local key for React rendering
}

export default function SurveyForm({
    survey,
    questions,
    events,
    selectedEventId,
    templates,
}: any) {
    const isEdit = !!survey;

    const [questionsList, setQuestionsList] = useState<QuestionItem[]>(
        questions?.map((q: any) => ({
            ...q,
            options: q.options ?? [],
            _key: `q-${q.id ?? Date.now()}`,
        })) ?? [],
    );

    const { data, setData, post, put, processing } = useForm({
        title: survey?.title ?? '',
        event_id:
            survey?.event_id?.toString() ?? selectedEventId?.toString() ?? '',
        activity_id: survey?.activity_id?.toString() ?? '',
        is_required: survey?.is_required ?? false,
        is_template: survey?.is_template ?? false,
        questions: [] as any[],
    });

    const applyTemplate = (templateUuid: string) => {
        const tpl = templates?.find((t: any) => t.uuid === templateUuid);
        if (!tpl) return;

        setData('title', tpl.title);
        setData('is_required', tpl.is_required);

        setQuestionsList(
            tpl.questions?.map((q: any) => ({
                ...q,
                id: undefined, // remove original ID so it's created new
                options:
                    q.options?.map((o: any) => ({
                        ...o,
                        id: undefined,
                    })) ?? [],
                _key: `q-template-${q.id}`,
            })) ?? [],
        );
    };

    const addQuestion = () => {
        const key = `q-${Date.now()}`;
        setQuestionsList([
            ...questionsList,
            {
                _key: key,
                question_type: 'rating',
                question: '',
                sort_order: questionsList.length,
                options: [],
            },
        ]);
    };

    const updateQuestion = (key: string, field: string, value: any) => {
        setQuestionsList(
            questionsList.map((q) =>
                q._key === key
                    ? {
                          ...q,
                          [field]: value,
                          options:
                              field === 'question_type' && value !== 'radio'
                                  ? []
                                  : q.options,
                      }
                    : q,
            ),
        );
    };

    const removeQuestion = (key: string) => {
        setQuestionsList(questionsList.filter((q) => q._key !== key));
    };

    const addOption = (qKey: string) => {
        setQuestionsList(
            questionsList.map((q) =>
                q._key === qKey
                    ? {
                          ...q,
                          options: [...q.options, { label: '', value: '' }],
                      }
                    : q,
            ),
        );
    };

    const updateOption = (
        qKey: string,
        oIndex: number,
        field: string,
        value: string,
    ) => {
        setQuestionsList(
            questionsList.map((q) =>
                q._key === qKey
                    ? {
                          ...q,
                          options: q.options.map((o, i) =>
                              i === oIndex
                                  ? {
                                        ...o,
                                        [field]: value,
                                        value:
                                            field === 'label' ? value : o.value,
                                    }
                                  : o,
                          ),
                      }
                    : q,
            ),
        );
    };

    const removeOption = (qKey: string, oIndex: number) => {
        setQuestionsList(
            questionsList.map((q) =>
                q._key === qKey
                    ? {
                          ...q,
                          options: q.options.filter((_, i) => i !== oIndex),
                      }
                    : q,
            ),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('questions', questionsList);
        if (isEdit) {
            put(`/admin/surveys/${survey.uuid}`, { onSuccess: () => {} });
        } else {
            post('/admin/surveys', { onSuccess: () => {} });
        }
    };

    return (
        <div>
            <Head title={isEdit ? 'Editar Encuesta' : 'Nueva Encuesta'} />
            <div className="mx-auto max-w-3xl space-y-6">
                <h2 className="text-lg font-semibold">
                    {isEdit ? 'Editar Encuesta' : 'Nueva Encuesta'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="grid gap-4">
                            {/* Template selector (only on create) */}
                            {!isEdit && templates?.length > 0 && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Crear desde plantilla
                                    </label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                applyTemplate(e.target.value);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                        defaultValue=""
                                    >
                                        <option value="">
                                            Empezar desde cero
                                        </option>
                                        {templates.map((t: any) => (
                                            <option key={t.uuid} value={t.uuid}>
                                                {t.title}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-[10px] text-gray-400">
                                        Selecciona una plantilla para pre-llenar
                                        las preguntas.
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">
                                    Título *
                                </label>
                                <input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                    required
                                    placeholder="Ej: Encuesta de Satisfacción"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Evento
                                    </label>
                                    <select
                                        value={data.event_id}
                                        onChange={(e) =>
                                            setData('event_id', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <option value="">Sin evento</option>
                                        {events?.map((e: any) => (
                                            <option key={e.id} value={e.id}>
                                                {e.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Tipo
                                    </label>
                                    <label className="mt-2 flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={data.is_required}
                                            onChange={(e) =>
                                                setData(
                                                    'is_required',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        Obligatoria (debe responderse antes de
                                        descargar constancia)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={data.is_template}
                                            onChange={(e) =>
                                                setData(
                                                    'is_template',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        Guardar como plantilla (reutilizable en
                                        otros eventos)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Preguntas ({questionsList.length})
                            </h3>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                            >
                                <Plus size={14} /> Agregar
                            </button>
                        </div>

                        {questionsList.length === 0 && (
                            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                                <p className="text-sm text-gray-500">
                                    Sin preguntas
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Agrega preguntas de calificación, opción
                                    múltiple o texto libre.
                                </p>
                            </div>
                        )}

                        {questionsList.map((q, qi) => (
                            <div
                                key={q._key}
                                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex items-start gap-3">
                                    <GripVertical
                                        size={16}
                                        className="mt-2 text-gray-300"
                                    />
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-400">
                                                #{qi + 1}
                                            </span>
                                            <select
                                                value={q.question_type}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        q._key,
                                                        'question_type',
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <option value="rating">
                                                    Escala 1-5
                                                </option>
                                                <option value="radio">
                                                    Opción múltiple
                                                </option>
                                                <option value="text">
                                                    Texto libre
                                                </option>
                                            </select>
                                            <div className="flex-1" />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeQuestion(q._key)
                                                }
                                                className="rounded p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <input
                                            value={q.question}
                                            onChange={(e) =>
                                                updateQuestion(
                                                    q._key,
                                                    'question',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Escribe la pregunta..."
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#001e38] dark:border-gray-700 dark:bg-gray-800 dark:focus:border-[#dcc355]"
                                        />

                                        {/* Options for radio type */}
                                        {q.question_type === 'radio' && (
                                            <div className="ml-4 space-y-2">
                                                <p className="text-xs text-gray-400">
                                                    Opciones:
                                                </p>
                                                {q.options.map((opt, oi) => (
                                                    <div
                                                        key={oi}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            value={opt.label}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    q._key,
                                                                    oi,
                                                                    'label',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={`Opción ${oi + 1}`}
                                                            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none dark:border-gray-700 dark:bg-gray-800"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeOption(
                                                                    q._key,
                                                                    oi,
                                                                )
                                                            }
                                                            className="rounded p-1 text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addOption(q._key)
                                                    }
                                                    className="text-xs text-[#001e38] hover:underline dark:text-[#dcc355]"
                                                >
                                                    + Agregar opción
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <a
                            href="/admin/surveys"
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                        >
                            Cancelar
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#001e38] px-4 py-2 text-sm font-medium text-white hover:bg-[#002d54] disabled:opacity-50 dark:bg-[#dcc355] dark:text-[#001e38]"
                        >
                            {processing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : null}
                            {isEdit ? 'Actualizar' : 'Crear Encuesta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
