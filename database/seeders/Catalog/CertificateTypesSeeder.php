<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CertificateTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['code' => 'attendance', 'name' => 'Asistencia'],
            ['code' => 'participation', 'name' => 'Participacion'],
            ['code' => 'speaker', 'name' => 'Ponente'],
            ['code' => 'organizer', 'name' => 'Organizador'],
            ['code' => 'volunteer', 'name' => 'Voluntario'],
            ['code' => 'contest_winner', 'name' => 'Ganador de Concurso'],
            ['code' => 'workshop', 'name' => 'Taller Completado'],
            ['code' => 'recognition', 'name' => 'Reconocimiento'],
        ];
        foreach ($types as $t) {
            DB::table('certificate_types')->insertOrIgnore([
                'code' => $t['code'], 'name' => $t['name'],
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
