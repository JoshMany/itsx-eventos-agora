<?php

namespace Database\Seeders\Demo;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSponsorsSeeder extends Seeder
{
    public function run(): void
    {
        $events = DB::table('events')->pluck('id');
        $sponsors = DB::table('sponsors')->pluck('id');
        $types = ['financial', 'in_kind', 'service'];
        foreach ($events as $eid) {
            $sids = $sponsors->shuffle()->take(fake()->numberBetween(1, 3));
            foreach ($sids as $sid) {
                DB::table('event_sponsors')->insertOrIgnore([
                    'event_id' => $eid, 'sponsor_id' => $sid, 'contribution_type' => fake()->randomElement($types),
                    'amount' => fake()->randomFloat(2, 5000, 50000), 'description' => fake()->sentence(),
                ]);
            }
        }
    }
}
