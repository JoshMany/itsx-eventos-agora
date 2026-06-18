<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ParticipantRolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['Attendee', 'Speaker', 'Organizer', 'Moderator', 'Volunteer', 'Judge', 'Sponsor Representative', 'Staff'];
        foreach ($roles as $role) {
            DB::table('participant_roles')->insertOrIgnore([
                'code' => Str::slug($role),
                'name' => $role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
