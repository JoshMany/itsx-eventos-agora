<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'events' => DB::table('events')->whereIn('status', ['published'])->count(),
                'registrations' => DB::table('event_registrations')->count(),
                'attendanceRate' => $this->attendanceRate(),
                'pendingCertificates' => DB::table('certificates')->whereNull('generated_at')->count(),
                'pendingEvents' => DB::table('events')->where('status', 'pending_review')->count(),
            ],
            'upcomingEvents' => DB::table('events')
                ->where('starts_at', '>', $now)
                ->where('status', 'published')
                ->orderBy('starts_at')
                ->limit(5)
                ->get(['uuid', 'title', 'starts_at']),
            'needsAttention' => [
                'pending_review' => DB::table('events')->where('status', 'pending_review')->count(),
                'pending_registrations' => DB::table('event_registrations')->where('status', 'pending')->count(),
                'uncertified' => DB::table('certificates')->whereNull('generated_at')->count(),
            ],
        ]);
    }

    private function attendanceRate(): float
    {
        $total = DB::table('event_registrations')->where('status', 'attended')->count();
        $confirmed = DB::table('event_registrations')->whereIn('status', ['confirmed', 'attended'])->count();

        return $confirmed > 0 ? round(($total / $confirmed) * 100, 1) : 0;
    }
}
