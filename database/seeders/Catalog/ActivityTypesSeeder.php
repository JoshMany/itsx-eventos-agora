<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivityTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['code' => 'conference', 'name' => 'Conferencia', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'workshop', 'name' => 'Taller', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'contest', 'name' => 'Concurso', 'supports_teams' => true, 'supports_certificates' => true, 'supports_speakers' => false],
            ['code' => 'hackathon', 'name' => 'Hackathon', 'supports_teams' => true, 'supports_certificates' => true, 'supports_speakers' => false],
            ['code' => 'panel', 'name' => 'Panel', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'round_table', 'name' => 'Mesa Redonda', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'networking', 'name' => 'Networking', 'supports_teams' => false, 'supports_certificates' => false, 'supports_speakers' => false],
            ['code' => 'exhibition', 'name' => 'Exposicion', 'supports_teams' => true, 'supports_certificates' => true, 'supports_speakers' => false],
            ['code' => 'course', 'name' => 'Curso', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'seminar', 'name' => 'Seminario', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => true],
            ['code' => 'ceremony', 'name' => 'Ceremonia', 'supports_teams' => false, 'supports_certificates' => true, 'supports_speakers' => false],
            ['code' => 'performance', 'name' => 'Presentacion Artistica', 'supports_teams' => true, 'supports_certificates' => false, 'supports_speakers' => false],
            ['code' => 'meeting', 'name' => 'Reunion', 'supports_teams' => false, 'supports_certificates' => false, 'supports_speakers' => false],
            ['code' => 'other', 'name' => 'Otro', 'supports_teams' => false, 'supports_certificates' => false, 'supports_speakers' => false],
        ];
        foreach ($types as $t) {
            DB::table('activity_types')->insertOrIgnore([
                'code' => $t['code'], 'name' => $t['name'],
                'requires_registration' => true,
                'supports_teams' => $t['supports_teams'],
                'supports_certificates' => $t['supports_certificates'],
                'supports_speakers' => $t['supports_speakers'],
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
