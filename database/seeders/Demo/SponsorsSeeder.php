<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SponsorsSeeder extends Seeder
{
    public function run(): void
    {
        $orgs = DB::table('organizations')->where('type', 'Company')->pluck('id', 'acronym');
        $sponsors = [
            ['acronym' => 'MSFT', 'contact_name' => 'Maria Garcia', 'contact_email' => 'maria@microsoft.com'],
            ['acronym' => 'GOOG', 'contact_name' => 'Carlos Ruiz', 'contact_email' => 'carlos@google.com'],
            ['acronym' => 'AWS', 'contact_name' => 'Ana Martinez', 'contact_email' => 'ana@aws.com'],
            ['acronym' => 'ORCL', 'contact_name' => 'Luis Hernandez', 'contact_email' => 'luis@oracle.com'],
        ];
        foreach ($sponsors as $s) {
            $orgId = $orgs[$s['acronym']] ?? null;
            DB::table('sponsors')->insert([
                'uuid' => (string) Str::orderedUuid(), 'organization_id' => $orgId,
                'contact_name' => $s['contact_name'], 'contact_email' => $s['contact_email'],
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
