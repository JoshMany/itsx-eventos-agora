<?php

namespace Database\Factories;

use App\Enums\ParticipantType;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Participant>
 */
class ParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(array_map(fn ($c) => $c->value, ParticipantType::cases())),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'organization_id' => null,
            'organization_name' => fake()->optional()->company(),
            'student_number' => null,
        ];
    }

    public function student(): static
    {
        return $this->state([
            'type' => ParticipantType::Student->value,
            'organization_name' => 'Instituto Tecnologico Superior de Xalapa',
            'student_number' => fake()->numerify('########'),
        ]);
    }

    public function staff(): static
    {
        return $this->state([
            'type' => ParticipantType::Staff->value,
            'organization_name' => 'Instituto Tecnologico Superior de Xalapa',
        ]);
    }

    public function external(): static
    {
        return $this->state([
            'type' => ParticipantType::External->value,
            'organization_name' => fake()->company(),
        ]);
    }
}
