<?php

namespace App\Actions\Participants;

use App\Models\Participant;

class RegisterParticipantAction
{
    /**
     * @param  array{
     *   type: string,
     *   first_name: string,
     *   last_name: string,
     *   email: string,
     *   phone?: string|null,
     *   institution?: string|null,
     *   student_number?: string|null,
     * } $data
     */
    public function execute(array $data): Participant
    {
        return Participant::firstOrCreate(
            ['email' => $data['email']],
            $data,
        );
    }
}
