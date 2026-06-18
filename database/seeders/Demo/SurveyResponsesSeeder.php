<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveyResponsesSeeder extends Seeder
{
    public function run(): void
    {
        $surveys = DB::table('surveys')->pluck('id');
        $participants = DB::table('participants')->pluck('id')->shuffle()->take(30);
        $questions = DB::table('survey_questions')->get();
        foreach ($surveys as $sid) {
            foreach ($participants as $pid) {
                $rid = DB::table('survey_responses')->insertGetId(['survey_id' => $sid, 'participant_id' => $pid, 'submitted_at' => now()->subDays(fake()->numberBetween(1, 5))]);
                foreach ($questions as $q) {
                    $answer = $q->question_type === 'rating' ? (string) fake()->numberBetween(1, 5) : ($q->question_type === 'radio' ? fake()->randomElement(['yes', 'maybe', 'no']) : fake()->sentence());
                    DB::table('survey_answers')->insert(['response_id' => $rid, 'question_id' => $q->id, 'answer' => $answer]);
                }
            }
        }
    }
}
