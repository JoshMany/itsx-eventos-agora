<?php

namespace Database\Seeders\Institutional;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganizationsSeeder extends Seeder
{
    public function run(): void
    {
        $orgs = [
            ['name' => 'Instituto Tecnologico Superior de Xalapa', 'acronym' => 'ITSX', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Universidad Veracruzana', 'acronym' => 'UV', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Universidad Nacional Autonoma de Mexico', 'acronym' => 'UNAM', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Instituto Politecnico Nacional', 'acronym' => 'IPN', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Tecnologico Nacional de Mexico', 'acronym' => 'TecNM', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Universidad Anahuac', 'acronym' => 'Anahuac', 'type' => 'University', 'is_verified' => false],
            ['name' => 'Instituto Tecnologico de Estudios Superiores de Monterrey', 'acronym' => 'ITESM', 'type' => 'University', 'is_verified' => true],
            ['name' => 'Microsoft', 'acronym' => 'MSFT', 'type' => 'Company', 'is_verified' => true],
            ['name' => 'Google', 'acronym' => 'GOOG', 'type' => 'Company', 'is_verified' => true],
            ['name' => 'Amazon Web Services', 'acronym' => 'AWS', 'type' => 'Company', 'is_verified' => true],
            ['name' => 'Oracle', 'acronym' => 'ORCL', 'type' => 'Company', 'is_verified' => true],
            ['name' => 'IBM', 'acronym' => 'IBM', 'type' => 'Company', 'is_verified' => true],
        ];
        foreach ($orgs as $o) {
            DB::table('organizations')->insertOrIgnore([
                'uuid' => (string) Str::orderedUuid(),
                'name' => $o['name'], 'acronym' => $o['acronym'],
                'type' => $o['type'], 'is_verified' => $o['is_verified'],
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
