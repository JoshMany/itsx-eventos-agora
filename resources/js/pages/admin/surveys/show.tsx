import { Head, Link } from '@inertiajs/react';
import { BarChart3 } from 'lucide-react';

const questionTypeLabels: Record<string, string> = {
    text: 'Texto libre',
    radio: 'Opción múltiple',
    rating: 'Escala 1-5',
};

export default function SurveyShow({ survey, questions, totalResponses }: any) {
    return (
        <div>
            <Head title={`${survey.title}`} />
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/admin/surveys" className="hover:text-gray-600">
                        Encuestas
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600">{survey.title}</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {survey.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {totalResponses} respuesta
                            {totalResponses !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/surveys/${survey.uuid}/edit`}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
                        >
                            Editar
                        </Link>
                    </div>
                </div>

                {/* Questions & Answers */}
                <div className="space-y-4">
                    {questions?.map((q: any, qi: number) => (
                        <div
                            key={q.id}
                            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="mb-4 flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#001e38] text-xs font-medium text-white dark:bg-[#dcc355] dark:text-[#001e38]">
                                    {qi + 1}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold">
                                        {q.question}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {questionTypeLabels[q.question_type] ??
                                            q.question_type}
                                    </p>
                                </div>
                            </div>

                            {/* Answers visualization */}
                            {q.question_type === 'rating' && (
                                <RatingChart answers={q.answers} />
                            )}
                            {q.question_type === 'radio' && (
                                <RadioChart
                                    answers={q.answers}
                                    options={q.options}
                                />
                            )}
                            {q.question_type === 'text' && (
                                <TextAnswers answers={q.answers} />
                            )}
                        </div>
                    ))}
                </div>

                {!questions?.length && (
                    <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                        <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                        <p className="text-sm text-gray-500">
                            Sin preguntas en esta encuesta
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* Rating Chart (1-5 bar chart) */
function RatingChart({ answers }: { answers: string[] }) {
    const counts = [0, 0, 0, 0, 0]; // indexes 0-4
    let total = 0;
    answers?.forEach((a) => {
        const n = parseInt(a);

        if (n >= 1 && n <= 5) {
            counts[n - 1]++;
            total++;
        }
    });

    const max = Math.max(...counts, 1);

    return (
        <div className="space-y-1.5">
            {counts.map((count, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="w-4 text-xs text-gray-400">{i + 1}</span>
                    <div className="h-5 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                        <div
                            className="h-full rounded bg-[#001e38] transition-all dark:bg-[#dcc355]"
                            style={{
                                width: `${(count / max) * 100}%`,
                            }}
                        />
                    </div>
                    <span className="w-6 text-right text-xs text-gray-500">
                        {count}
                    </span>
                </div>
            ))}
            <p className="text-[10px] text-gray-400">
                Promedio:{' '}
                {total > 0
                    ? (
                          counts.reduce((sum, c, i) => sum + c * (i + 1), 0) /
                          total
                      ).toFixed(1)
                    : '—'}{' '}
                · {total} respuestas
            </p>
        </div>
    );
}

/* Radio Chart (option distribution) */
function RadioChart({
    answers,
    options,
}: {
    answers: string[];
    options: { label: string; value: string }[];
}) {
    const counts: Record<string, number> = {};
    answers?.forEach((a) => {
        counts[a] = (counts[a] ?? 0) + 1;
    });

    const total = answers?.length ?? 0;
    const allLabels = options?.length
        ? options.map((o) => o.label)
        : Object.keys(counts);

    const max = Math.max(...Object.values(counts), 1);

    return (
        <div className="space-y-1.5">
            {allLabels.map((label) => {
                const opt = options?.find((o) => o.label === label);
                const value = opt?.value ?? label;
                const count = counts[value] ?? 0;

                return (
                    <div key={label} className="flex items-center gap-3">
                        <span className="w-32 truncate text-xs text-gray-500">
                            {label}
                        </span>
                        <div className="h-5 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                            <div
                                className="h-full rounded bg-[#001e38] transition-all dark:bg-[#dcc355]"
                                style={{
                                    width: `${(count / max) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="w-16 text-right text-xs text-gray-500">
                            {count}
                            {total > 0 &&
                                ` (${Math.round((count / total) * 100)}%)`}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* Text Answers (list) */
function TextAnswers({ answers }: { answers: string[] }) {
    if (!answers?.length) {
        return <p className="text-xs text-gray-400">Sin respuestas aún.</p>;
    }

    return (
        <div className="space-y-2">
            {answers.map((a, i) => (
                <div
                    key={i}
                    className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800/50 dark:text-gray-300"
                >
                    "{a}"
                </div>
            ))}
        </div>
    );
}
