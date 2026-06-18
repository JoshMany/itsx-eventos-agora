<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Academic', 'Research', 'Technology', 'Cultural', 'Sports',
            'Entrepreneurship', 'Community', 'Institutional', 'International', 'Other',
        ];
        foreach ($categories as $cat) {
            DB::table('event_categories')->insertOrIgnore([
                'name' => $cat,
                'slug' => Str::slug($cat),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
