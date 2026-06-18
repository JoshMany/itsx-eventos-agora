<?php

namespace Database\Seeders\Institutional;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CertificateTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = ['Default Attendance', 'Default Participation', 'Default Speaker', 'Default Organizer'];
        foreach ($templates as $t) {
            DB::table('certificate_templates')->insertOrIgnore([
                'uuid' => (string) Str::orderedUuid(),
                'name' => $t, 'is_active' => true,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
