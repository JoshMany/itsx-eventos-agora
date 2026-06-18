<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reports/index', [
            'eventCount' => DB::table('events')->count(),
            'participantCount' => DB::table('participants')->count(),
            'registrationCount' => DB::table('event_registrations')->count(),
            'certificateCount' => DB::table('certificates')->count(),
            'eventsByStatus' => DB::table('events')
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get(),
            'participantsByType' => DB::table('participants')
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->get(),
            'registrationsByStatus' => DB::table('event_registrations')
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get(),
            'recentEvents' => DB::table('events')
                ->select(['title', 'starts_at', 'status'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),
        ]);
    }
}
