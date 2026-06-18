<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CertificatesSeeder extends Seeder
{
    public function run(): void
    {
        $events = DB::table('events')->pluck('id');
        $participants = DB::table('participants')->pluck('id')->shuffle()->take(100);
        $certType = DB::table('certificate_types')->where('code', 'attendance')->value('id');
        $template = DB::table('certificate_templates')->first()?->id;
        foreach ($participants as $pid) {
            DB::table('certificates')->insert([
                'uuid' => (string) Str::orderedUuid(), 'participant_id' => $pid,
                'event_id' => $events->random(), 'certificate_type_id' => $certType, 'template_id' => $template,
                'folio' => 'AGT-'.strtoupper(Str::random(8)), 'verification_code' => Str::random(12),
                'generated_at' => now(), 'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
