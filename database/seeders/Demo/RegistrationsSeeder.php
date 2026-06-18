<?php

namespace Database\Seeders\Demo;

use App\Enums\RegistrationStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegistrationsSeeder extends Seeder
{
    public function run(): void
    {
        $events = DB::table('events')->pluck('id');
        $participants = DB::table('participants')->pluck('id')->shuffle();
        $statuses = RegistrationStatus::cases();
        $count = min(300, $participants->count());

        for ($i = 0; $i < $count; $i++) {
            $eventId = $events->random();
            $pid = $participants[$i];
            $status = fake()->randomElement($statuses);
            DB::table('event_registrations')->insertOrIgnore([
                'uuid' => (string) Str::orderedUuid(), 'event_id' => $eventId, 'participant_id' => $pid,
                'status' => $status->value, 'registered_at' => now()->subDays(fake()->numberBetween(1, 30)),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
