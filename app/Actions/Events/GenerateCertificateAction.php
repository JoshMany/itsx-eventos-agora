<?php

namespace App\Actions\Events;

use App\Models\Certificate;
use App\Models\CertificateTemplate;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateCertificateAction
{
    public function execute(
        Participant $participant,
        Event $event,
        ?int $activityId = null,
        ?int $certificateTypeId = null,
        ?int $templateId = null,
    ): Certificate {
        $typeId = $certificateTypeId ?? DB::table('certificate_types')
            ->where('code', 'attendance')
            ->value('id');

        // Duplicate check
        $exists = Certificate::query()
            ->where('participant_id', $participant->id)
            ->where('event_id', $event->id)
            ->where('activity_id', $activityId)
            ->where('certificate_type_id', $typeId)
            ->exists();

        if ($exists) {
            $typeName = DB::table('certificate_types')->where('id', $typeId)->value('name');
            $activityLabel = $activityId
                ? DB::table('activities')->where('id', $activityId)->value('title')
                : 'el evento';

            throw new \RuntimeException(
                "El participante ya tiene una constancia de «{$typeName}» para {$activityLabel}."
            );
        }

        $templateId = $templateId ?? CertificateTemplate::query()
            ->where('is_active', true)
            ->value('id');

        $folio = $this->generateFolio();

        $verificationCode = hash_hmac(
            'sha256',
            implode('|', [$folio, $participant->id, $event->id]),
            (string) config('app.key'),
        );

        $certificate = DB::transaction(function () use ($participant, $event, $activityId, $typeId, $templateId, $folio, $verificationCode): Certificate {
            /** @var Certificate $certificate */
            $certificate = Certificate::query()->create([
                'participant_id' => $participant->id,
                'event_id' => $event->id,
                'activity_id' => $activityId,
                'certificate_type_id' => $typeId,
                'template_id' => $templateId,
                'folio' => $folio,
                'verification_code' => $verificationCode,
                'generated_at' => now(),
            ]);

            return $certificate;
        });

        return $certificate;
    }

    private function generateFolio(): string
    {
        $prefix = 'CON-'.now()->year;
        $last = DB::table('certificates')
            ->where('folio', 'like', $prefix.'-%')
            ->orderByDesc('id')
            ->value('folio');

        $next = $last ? (int) Str::afterLast($last, '-') + 1 : 1;

        return $prefix.'-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }
}
