<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyOption;
use App\Models\SurveyQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    public function index(Request $request): Response
    {
        $trashed = $request->query('trashed') === '1';
        $query = $trashed ? Survey::onlyTrashed() : Survey::query();

        $surveys = $query
            ->leftJoin('events', 'surveys.event_id', '=', 'events.id')
            ->select([
                'surveys.*',
                'events.title as event_title',
            ])
            ->orderByDesc('surveys.deleted_at')
            ->orderByDesc('surveys.created_at')
            ->paginate(20);

        return Inertia::render('admin/surveys/index', [
            'surveys' => $surveys,
            'showingTrashed' => $trashed,
        ]);
    }

    public function restore(string $uuid): RedirectResponse
    {
        Survey::onlyTrashed()->where('uuid', $uuid)->firstOrFail()->restore();

        return redirect()->back()->with('success', 'Encuesta restaurada.');
    }

    public function create(Request $request): Response
    {
        $templates = Survey::query()
            ->where('is_template', true)
            ->with('questions.options')
            ->get();

        return Inertia::render('admin/surveys/form', [
            'events' => DB::table('events')->orderBy('title')->get(['id', 'uuid', 'title']),
            'selectedEventId' => $request->query('event_id'),
            'templates' => $templates,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'event_id' => 'nullable|integer|exists:events,id',
            'activity_id' => 'nullable|integer|exists:activities,id',
            'is_required' => 'boolean',
            'is_template' => 'boolean',
            'questions' => 'nullable|array',
            'questions.*.question_type' => 'required|string|in:text,radio,rating',
            'questions.*.question' => 'required|string',
            'questions.*.sort_order' => 'integer',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*.label' => 'required|string',
            'questions.*.options.*.value' => 'required|string',
        ]);

        $survey = Survey::query()->create($data);

        $this->syncQuestions($survey, $data['questions'] ?? []);

        return redirect()->route('admin.surveys.index')->with('success', 'Encuesta creada.');
    }

    public function edit(string $uuid): Response
    {
        $survey = Survey::query()->where('uuid', $uuid)->firstOrFail();

        return Inertia::render('admin/surveys/form', [
            'survey' => $survey,
            'questions' => $survey->questions()->with('options')->get(),
            'events' => DB::table('events')->orderBy('title')->get(['id', 'uuid', 'title']),
            'templates' => Survey::query()->where('is_template', true)->with('questions.options')->get(),
        ]);
    }

    public function update(Request $request, string $uuid): RedirectResponse
    {
        $survey = Survey::query()->where('uuid', $uuid)->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'event_id' => 'nullable|integer|exists:events,id',
            'activity_id' => 'nullable|integer|exists:activities,id',
            'is_required' => 'boolean',
            'is_template' => 'boolean',
            'questions' => 'nullable|array',
            'questions.*.id' => 'nullable|integer|exists:survey_questions,id',
            'questions.*.question_type' => 'required|string|in:text,radio,rating',
            'questions.*.question' => 'required|string',
            'questions.*.sort_order' => 'integer',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*.label' => 'required|string',
            'questions.*.options.*.value' => 'required|string',
        ]);

        $survey->update([
            'title' => $data['title'],
            'event_id' => $data['event_id'] ?? null,
            'activity_id' => $data['activity_id'] ?? null,
            'is_required' => $data['is_required'] ?? false,
            'is_template' => $data['is_template'] ?? false,
        ]);

        $this->syncQuestions($survey, $data['questions'] ?? []);

        return redirect()->route('admin.surveys.index')->with('success', 'Encuesta actualizada.');
    }

    public function show(string $uuid): Response
    {
        $survey = Survey::query()->where('uuid', $uuid)->firstOrFail();

        $questions = $survey->questions()
            ->with('options')
            ->get()
            ->map(function ($q) use ($survey) {
                return [
                    'id' => $q->id,
                    'question_type' => $q->question_type,
                    'question' => $q->question,
                    'options' => $q->options,
                    'answers' => DB::table('survey_answers')
                        ->where('question_id', $q->id)
                        ->whereIn('response_id', DB::table('survey_responses')
                            ->where('survey_id', $survey->id)
                            ->select('id'))
                        ->pluck('answer'),
                ];
            });

        $totalResponses = $survey->responses()->count();

        return Inertia::render('admin/surveys/show', [
            'survey' => $survey,
            'questions' => $questions,
            'totalResponses' => $totalResponses,
        ]);
    }

    public function destroy(string $uuid): RedirectResponse
    {
        Survey::query()->where('uuid', $uuid)->firstOrFail()->delete();

        return redirect()->route('admin.surveys.index')->with('success', 'Encuesta eliminada.');
    }

    private function syncQuestions(Survey $survey, array $questions): void
    {
        $existingIds = $survey->questions()->pluck('id')->toArray();
        $incomingIds = collect($questions)->pluck('id')->filter()->toArray();
        $deletedIds = array_diff($existingIds, $incomingIds);

        SurveyQuestion::query()->whereIn('id', $deletedIds)->delete();

        foreach ($questions as $i => $qData) {
            $question = SurveyQuestion::query()->updateOrCreate(
                ['id' => $qData['id'] ?? null],
                [
                    'survey_id' => $survey->id,
                    'question_type' => $qData['question_type'],
                    'question' => $qData['question'],
                    'sort_order' => $qData['sort_order'] ?? $i,
                ],
            );

            if ($qData['question_type'] === 'radio' && isset($qData['options'])) {
                $existingOptIds = $question->options()->pluck('id')->toArray();
                $incomingOptIds = collect($qData['options'])->pluck('id')->filter()->toArray();
                $deletedOptIds = array_diff($existingOptIds, $incomingOptIds);

                SurveyOption::query()->whereIn('id', $deletedOptIds)->delete();

                foreach ($qData['options'] as $opt) {
                    SurveyOption::query()->updateOrCreate(
                        ['id' => $opt['id'] ?? null],
                        [
                            'question_id' => $question->id,
                            'label' => $opt['label'],
                            'value' => $opt['value'] ?? $opt['label'],
                        ],
                    );
                }
            } else {
                $question->options()->delete();
            }
        }
    }
}
