<?php

namespace App\Actions\Participants;

use App\Models\Participant;

class CreateParticipantAccountAction
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
    public function execute(Participant $participant, array $data): Participant
    {
        $participant->update($data);

        return $participant->fresh();
    }
}
