<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TagsSeeder extends Seeder
{
    public function run(): void
    {
        $tags = ['AI', 'Machine Learning', 'Cloud', 'AWS', 'Docker', 'DevOps', 'Cybersecurity', 'Research', 'Innovation', 'Leadership', 'Programming', 'Data Science', 'Education', 'IoT', 'Blockchain', 'UX Design', 'Agile', 'Scrum', 'Big Data', 'Mobile Dev'];
        foreach ($tags as $tag) {
            DB::table('tags')->insertOrIgnore([
                'name' => $tag,
                'slug' => Str::slug($tag),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
