<?php

namespace Database\Seeders\Demo;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        $venues = DB::table('venues')->pluck('id', 'name');
        $rooms = DB::table('rooms')->pluck('id', 'name');
        $activityTypes = DB::table('activity_types')->pluck('id', 'code');
        $categories = DB::table('event_categories')->pluck('id', 'slug');
        $tags = DB::table('tags')->pluck('id', 'slug');
        $roles = DB::table('participant_roles')->pluck('id', 'code');
        $participants = DB::table('participants')->pluck('id');
        $itsxCampus = $venues['ITSX Campus Central'] ?? 1;

        // Event 1: Simple - Concierto de Bienvenida
        $e1 = Event::create([
            'uuid' => Str::orderedUuid(), 'title' => 'Concierto de Bienvenida ITSX 2026',
            'slug' => 'concierto-bienvenida-2026', 'short_description' => 'Evento musical de bienvenida al ciclo escolar.',
            'description' => 'Gran concierto de bienvenida con bandas locales y nacionales. Entrada libre para la comunidad ITSX.',
            'status' => 'published', 'capacity' => 1000, 'starts_at' => now()->addDays(30), 'ends_at' => now()->addDays(30)->addHours(4),
            'registration_starts_at' => now()->subDays(10), 'registration_ends_at' => now()->addDays(29),
            'venue_id' => $itsxCampus, 'room_id' => $rooms['Cancha Principal'] ?? null, 'published_at' => now(),
        ]);
        $this->attachCategories($e1, $categories, ['cultural']);
        $this->attachTags($e1, $tags, ['music']);
        $this->createActivity($e1, null, $activityTypes, $rooms, ['conference' => 'Bienvenida del Director', 'performance' => 'Concierto Estelar'], $itsxCampus, $e1->starts_at);

        // Event 2: Medium - Congreso de Inteligencia Artificial
        $e2 = Event::create([
            'uuid' => Str::orderedUuid(), 'title' => 'Congreso de Inteligencia Artificial y Ciencia de Datos',
            'slug' => 'congreso-ia-ds-2026', 'short_description' => 'Congreso academico sobre IA, Machine Learning y Data Science.',
            'description' => 'El congreso reune a expertos nacionales e internacionales para compartir avances en IA, ML y DS. Incluye conferencias magistrales, talleres practicos y concurso de proyectos.',
            'status' => 'published', 'capacity' => 500, 'starts_at' => now()->addDays(45), 'ends_at' => now()->addDays(47),
            'registration_starts_at' => now(), 'registration_ends_at' => now()->addDays(44),
            'venue_id' => $itsxCampus, 'room_id' => $rooms['Auditorio ITSX'] ?? null, 'published_at' => now(),
        ]);
        $this->attachCategories($e2, $categories, ['technology', 'research', 'academic']);
        $this->attachTags($e2, $tags, ['ai', 'machine-learning', 'data-science', 'cloud', 'innovation']);
        $trackIds = $this->createTracks($e2, ['Eje 1: Fundamentos de IA', 'Eje 2: Aplicaciones Prácticas', 'Eje 3: Ciencia de Datos']);
        $t1 = $trackIds[0];
        $t2 = $trackIds[1];
        $t3 = $trackIds[2];
        $day1 = $e2->starts_at;
        $day2 = (clone $day1)->addDay();
        $this->createActivity($e2, $t1, $activityTypes, $rooms, ['conference' => 'Keynote: El Futuro de la IA', 'workshop' => 'Python para Machine Learning', 'panel' => 'Etica en IA'], $itsxCampus, $day1);
        $this->createActivity($e2, $t2, $activityTypes, $rooms, ['conference' => 'Computer Vision en la Industria', 'workshop' => 'Deep Learning con TensorFlow', 'contest' => 'Hackathon de IA'], $itsxCampus, $day2);
        $this->createActivity($e2, $t3, $activityTypes, $rooms, ['conference' => 'Big Data Analytics', 'seminar' => 'Procesamiento de Lenguaje Natural', 'workshop' => 'Data Visualization con Python'], $itsxCampus, $day2);

        // Event 3: Complex - Semana Academica ITSX
        $e3 = Event::create([
            'uuid' => Str::orderedUuid(), 'title' => 'Semana Academica ITSX 2026',
            'slug' => 'semana-academica-2026', 'short_description' => 'La semana mas importante del calendario academico ITSX.',
            'description' => 'Semana Academica con conferencias, talleres, concursos y actividades culturales para toda la comunidad estudiantil. 20 actividades en 3 ejes simultáneos.',
            'status' => 'published', 'capacity' => 3000, 'starts_at' => now()->addDays(90), 'ends_at' => now()->addDays(95),
            'registration_starts_at' => now()->addDays(30), 'registration_ends_at' => now()->addDays(89),
            'venue_id' => $itsxCampus, 'published_at' => now(),
        ]);
        $this->attachCategories($e3, $categories, ['academic', 'technology', 'cultural', 'sports', 'institutional']);
        $this->attachTags($e3, $tags, ['innovation', 'leadership', 'education', 'research', 'devops', 'cybersecurity']);
        $trk = $this->createTracks($e3, ['Eje Académico', 'Eje Tecnológico', 'Eje Cultural']);
        $t1 = $trk[0];
        $t2 = $trk[1];
        $t3 = $trk[2];
        $d1 = $e3->starts_at;
        $d2 = (clone $d1)->addDay();
        $d3 = (clone $d1)->addDays(2);
        $this->createActivity($e3, $t1, $activityTypes, $rooms, ['conference' => 'Conferencia Magistral', 'panel' => 'Panel de Investigacion', 'round_table' => 'Mesa Redonda: Educacion 4.0', 'workshop' => 'Redaccion Cientifica', 'seminar' => 'Metodologia de la Investigacion', 'ceremony' => 'Inauguracion'], $itsxCampus, $d1);
        $this->createActivity($e3, $t2, $activityTypes, $rooms, ['workshop' => 'Docker para Desarrolladores', 'contest' => 'Concurso de Programacion', 'workshop' => 'Ciberseguridad Basica', 'workshop' => 'Cloud Computing con AWS', 'conference' => 'Transformacion Digital', 'hackathon' => 'Hackathon ITSX 24hrs', 'meeting' => 'Networking Tecnologico'], $itsxCampus, $d2);
        $this->createActivity($e3, $t3, $activityTypes, $rooms, ['performance' => 'Noche Cultural', 'exhibition' => 'Exposicion de Proyectos', 'workshop' => 'Emprendimiento', 'ceremony' => 'Clausura y Premiacion'], $itsxCampus, $d3);
    }

    private function attachCategories($event, $categories, array $slugs): void
    {
        foreach ($slugs as $slug) {
            if (isset($categories[$slug])) {
                DB::table('event_category_event')->insertOrIgnore(['event_id' => $event->id, 'category_id' => $categories[$slug]]);
            }
        }
    }

    private function attachTags($event, $tags, array $slugs): void
    {
        foreach ($slugs as $slug) {
            if (isset($tags[$slug])) {
                DB::table('taggables')->insertOrIgnore(['tag_id' => $tags[$slug], 'taggable_type' => Event::class, 'taggable_id' => $event->id]);
            }
        }
    }

    private function createTracks($event, array $names): array
    {
        $ids = [];
        foreach ($names as $i => $name) {
            $ids[] = DB::table('tracks')->insertGetId(['uuid' => Str::orderedUuid(), 'event_id' => $event->id, 'name' => $name, 'sort_order' => $i, 'created_at' => now(), 'updated_at' => now()]);
        }

        return $ids;
    }

    private function createActivity($event, $trackId, $activityTypes, $rooms, array $activities, $venueId, $baseDate): void
    {
        $hour = 8;
        foreach ($activities as $typeCode => $title) {
            $typeId = $activityTypes[$typeCode] ?? $activityTypes->first();
            $starts = (clone $baseDate)->setTime($hour, 0);
            $ends = (clone $starts)->addHours(2);
            $roomId = $rooms->random();
            DB::table('activities')->insert([
                'uuid' => (string) Str::orderedUuid(), 'event_id' => $event->id, 'track_id' => $trackId,
                'activity_type_id' => $typeId, 'title' => $title, 'capacity' => 40,
                'starts_at' => $starts, 'ends_at' => $ends, 'venue_id' => $venueId, 'room_id' => $roomId,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $hour += 2;
            if ($hour >= 20) {
                $hour = 8;
            }
        }
    }
}
