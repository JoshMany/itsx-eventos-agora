<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SponsorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/sponsors/index', [
            'sponsors' => Sponsor::query()
                ->with('event:id,uuid,title')
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function store(Request $request, string $event): RedirectResponse
    {
        $data = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'website' => 'nullable|string|max:500',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'sponsorship_type' => 'required|in:financial,in_kind,media,academic,venue',
            'contribution_description' => 'nullable|string',
            'contribution_value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        Sponsor::query()->create($data);

        return redirect()->back()->with('success', 'Patrocinador agregado.');
    }

    public function update(Request $request, string $event, string $sponsorId): RedirectResponse
    {
        $sponsor = Sponsor::query()->findOrFail($sponsorId);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'website' => 'nullable|string|max:500',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'sponsorship_type' => 'sometimes|in:financial,in_kind,media,academic,venue',
            'contribution_description' => 'nullable|string',
            'contribution_value' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:prospective,confirmed,active,completed,cancelled',
        ]);

        $sponsor->update($data);

        return redirect()->back()->with('success', 'Patrocinador actualizado.');
    }

    public function destroy(string $event, string $sponsorId): RedirectResponse
    {
        Sponsor::query()->findOrFail($sponsorId)->delete();

        return redirect()->back()->with('success', 'Patrocinador eliminado.');
    }
}
