<?php

namespace Database\Seeders\Demo;

use App\Models\Participant;
use Illuminate\Database\Seeder;

class ParticipantsSeeder extends Seeder
{
    public function run(): void
    {
        Participant::factory()->count(200)->student()->create();
        Participant::factory()->count(50)->external()->create();
        Participant::factory()->count(20)->staff()->create();
    }
}
