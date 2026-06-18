<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AttendancesSeeder extends Seeder
{
    public function run(): void
    {
        $registrations = DB::table('event_registrations')->whereIn('status', ['confirmed', 'attended'])->get();
        foreach ($registrations as $reg) {
            if (fake()->boolean(80)) {
                DB::table('event_attendances')->insertOrIgnore([
                    'uuid' => (string) Str::orderedUuid(), 'event_id' => $reg->event_id,
                    'participant_id' => $reg->participant_id, 'checked_in_at' => now()->subDays(fake()->numberBetween(1, 10)),
                ]);
            }
        }
    }
}
