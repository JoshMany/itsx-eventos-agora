<?php

namespace App\Actions\Events;

use App\Models\Certificate;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;

class BulkGenerateCertificatesAction
{
    public function __construct(
        private readonly GenerateCertificateAction $generateAction,
    ) {}

    /**
     * Generate certificates for all registered participants of an event.
     * Skips participants who already have a matching certificate.
     *
     * @return array{generated: int, skipped: int, errors: array}
     */
    public function execute(
        Event $event,
        ?int $activityId = null,
        ?int $certificateTypeId = null,
    ): array {
        $participants = DB::table('event_registrations')
            ->where('event_id', $event->id)
            ->join('participants', 'event_registrations.participant_id', '=', 'participants.id')
            ->select('participants.*')
            ->get();

        $generated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($participants as $participantData) {
            $participant = (new Participant)->forceFill((array) $participantData);

            // Check if certificate already exists
            $exists = Certificate::query()
                ->where('participant_id', $participant->id)
                ->where('event_id', $event->id)
                ->where('activity_id', $activityId)
                ->where('certificate_type_id', $certificateTypeId)
                ->exists();

            if ($exists) {
                $skipped++;

                continue;
            }

            try {
                $this->generateAction->execute(
                    participant: $participant,
                    event: $event,
                    activityId: $activityId,
                    certificateTypeId: $certificateTypeId,
                );

                $generated++;
            } catch (\Exception $e) {
                $errors[] = "{$participant->first_name} {$participant->last_name}: {$e->getMessage()}";
            }
        }

        return [
            'generated' => $generated,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }
}
