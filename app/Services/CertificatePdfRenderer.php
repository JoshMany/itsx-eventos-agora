<?php

namespace App\Services;

use App\Models\Certificate;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\DB;
use Spatie\Browsershot\Browsershot;

class CertificatePdfRenderer
{
    public function render(Certificate $certificate): string
    {
        $certificate->loadMissing('participant', 'event');

        $certificateType = DB::table('certificate_types')
            ->where('id', $certificate->certificate_type_id)
            ->first();

        $activity = $certificate->activity_id
            ? DB::table('activities')->where('id', $certificate->activity_id)->first()
            : null;

        $verificationUrl = route('certificates.validate', ['folio' => $certificate->folio], true);

        $qrCodeDataUri = $this->generateQrDataUri($verificationUrl);

        $html = view('pdf.certificate', [
            'certificate' => $certificate,
            'participant' => $certificate->participant,
            'event' => $certificate->event,
            'certificateType' => $certificateType,
            'activity' => $activity,
            'qrCodeDataUri' => $qrCodeDataUri,
        ])->render();

        return Browsershot::html($html)
            ->format('LETTER')
            ->landscape()
            ->margins(0, 0, 0, 0)
            ->noSandbox()
            ->setNodeBinary('node')
            ->setNpmBinary('npm')
            ->pdf();
    }

    private function generateQrDataUri(string $data): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(180),
            new SvgImageBackEnd,
        );

        $writer = new Writer($renderer);

        $svg = $writer->writeString($data);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
