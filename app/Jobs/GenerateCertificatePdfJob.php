<?php

namespace App\Jobs;

use App\Models\Certificate;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateCertificatePdfJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        public Certificate $certificate,
    ) {}

    public function handle(): void
    {
        $certificate = $this->certificate->fresh();
        $participant = $certificate->participant;
        $event = $certificate->event;

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
            'participant' => $participant,
            'event' => $event,
            'certificateType' => $certificateType,
            'activity' => $activity,
            'qrCodeDataUri' => $qrCodeDataUri,
        ])->render();

        $filename = str_replace('/', '_', $certificate->folio).'.pdf';
        $path = 'certificates/'.$filename;

        Browsershot::html($html)
            ->format('LETTER')
            ->landscape()
            ->margins(0, 0, 0, 0)
            ->noSandbox()
            ->setNodeBinary('node')
            ->setNpmBinary('npm')
            ->save(Storage::disk('local')->path($path));

        $certificate->updateQuietly([
            'pdf_path' => $path,
        ]);
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
