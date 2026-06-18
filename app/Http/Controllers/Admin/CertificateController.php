<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Events\BulkGenerateCertificatesAction;
use App\Actions\Events\GenerateCertificateAction;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\Participant;
use App\Services\CertificatePdfRenderer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/certificates/index', ['certificates' => DB::table('certificates')->join('participants', 'certificates.participant_id', '=', 'participants.id')->join('events', 'certificates.event_id', '=', 'events.id')->select(['certificates.*', 'participants.first_name', 'participants.last_name', 'events.title as event_title'])->orderByDesc('certificates.created_at')->paginate(25)]);
    }

    public function show(string $uuid): Response
    {
        $c = DB::table('certificates')->where('certificates.uuid', $uuid)->join('participants', 'certificates.participant_id', '=', 'participants.id')->join('events', 'certificates.event_id', '=', 'events.id')->select(['certificates.*', 'participants.first_name', 'participants.last_name', 'participants.email', 'events.title as event_title'])->firstOrFail();

        return Inertia::render('admin/certificates/show', ['certificate' => $c]);
    }

    public function generate(Request $request, string $event, GenerateCertificateAction $action): RedirectResponse
    {
        $data = $request->validate([
            'participant_id' => 'required|integer|exists:participants,id',
            'activity_id' => 'nullable|integer|exists:activities,id',
            'certificate_type_id' => 'nullable|integer|exists:certificate_types,id',
        ]);

        $participant = Participant::query()->findOrFail($data['participant_id']);
        $eventModel = Event::query()->where('uuid', $event)->firstOrFail();

        try {
            $certificate = $action->execute(
                participant: $participant,
                event: $eventModel,
                activityId: $data['activity_id'] ?? null,
                certificateTypeId: $data['certificate_type_id'] ?? null,
            );
        } catch (\RuntimeException $e) {
            return redirect()->back()->withErrors(['certificate' => $e->getMessage()]);
        }

        return redirect()->back()->with('success', "Constancia {$certificate->folio} generada.");
    }

    public function generateBulk(Request $request, string $event, BulkGenerateCertificatesAction $action): RedirectResponse
    {
        $data = $request->validate([
            'certificate_type_id' => 'nullable|integer|exists:certificate_types,id',
            'activity_id' => 'nullable|integer|exists:activities,id',
        ]);

        $eventModel = Event::query()->where('uuid', $event)->firstOrFail();

        $result = $action->execute(
            event: $eventModel,
            activityId: $data['activity_id'] ?? null,
            certificateTypeId: $data['certificate_type_id'] ?? null,
        );

        $message = "{$result['generated']} constancias generadas.";

        if ($result['skipped'] > 0) {
            $message .= " {$result['skipped']} participantes ya tenían constancia.";
        }

        if (! empty($result['errors'])) {
            return redirect()->back()->with('warning', $message)->with('bulkErrors', $result['errors']);
        }

        return redirect()->back()->with('success', $message);
    }

    public function download(string $uuid, CertificatePdfRenderer $renderer): StreamedResponse
    {
        $certificate = Certificate::query()->where('uuid', $uuid)->firstOrFail();

        $pdfContent = $renderer->render($certificate);

        return response()->streamDownload(function () use ($pdfContent) {
            echo $pdfContent;
        }, $certificate->folio.'.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
