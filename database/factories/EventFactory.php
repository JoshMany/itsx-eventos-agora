<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(4),
            'short_description' => fake()->optional()->sentence(),
            'description' => fake()->optional()->paragraph(),
            'capacity' => fake()->optional()->numberBetween(20, 500),
            'starts_at' => now()->addDays(fake()->numberBetween(1, 90)),
            'ends_at' => fn (array $attrs) => $attrs['starts_at'] ? (clone $attrs['starts_at'])->addHours(fake()->numberBetween(2, 8)) : null,
            'registration_starts_at' => now()->subDays(fake()->numberBetween(1, 5)),
            'registration_ends_at' => now()->addDays(fake()->numberBetween(7, 60)),
            'status' => 'published',
        ];
    }
}
