<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SurveysSeeder extends Seeder
{
    public function run(): void
    {
        $events = DB::table('events')->pluck('id');
        $eventId = $events->first();

        $s1 = DB::table('surveys')->insertGetId(['uuid' => (string) Str::orderedUuid(), 'event_id' => $eventId, 'title' => 'Encuesta de Satisfaccion del Evento', 'is_required' => false, 'created_at' => now(), 'updated_at' => now()]);
        $qs = [
            ['question_type' => 'rating', 'question' => 'Como calificarias la organizacion del evento?', 'sort_order' => 1],
            ['question_type' => 'rating', 'question' => 'Como calificarias la calidad de las actividades?', 'sort_order' => 2],
            ['question_type' => 'radio', 'question' => 'Recomendarias este evento a otros estudiantes?', 'sort_order' => 3],
            ['question_type' => 'text', 'question' => 'Que fue lo que mas te gusto?', 'sort_order' => 4],
            ['question_type' => 'text', 'question' => 'Que sugerencias tienes para mejorar?', 'sort_order' => 5],
        ];
        foreach ($qs as $q) {
            $qId = DB::table('survey_questions')->insertGetId(['survey_id' => $s1, 'question_type' => $q['question_type'], 'question' => $q['question'], 'sort_order' => $q['sort_order'], 'created_at' => now(), 'updated_at' => now()]);
            if ($q['question_type'] === 'radio') {
                DB::table('survey_options')->insert(['question_id' => $qId, 'label' => 'Si, definitivamente', 'value' => 'yes', 'created_at' => now(), 'updated_at' => now()]);
                DB::table('survey_options')->insert(['question_id' => $qId, 'label' => 'Probablemente', 'value' => 'maybe', 'created_at' => now(), 'updated_at' => now()]);
                DB::table('survey_options')->insert(['question_id' => $qId, 'label' => 'No', 'value' => 'no', 'created_at' => now(), 'updated_at' => now()]);
            }
        }
    }
}
