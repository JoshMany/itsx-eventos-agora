<?php

namespace App\Actions\Events;

use App\Enums\RegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\DB;

class GetHomeStatsAction
{
    public function execute(): array
    {
        $year = now()->year;

        /** @var Event|null $nextEvent */
        $nextEvent = Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>', now())
            ->orderBy('starts_at')
            ->first();

        $upcomingEvents = Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>', now())
            ->orderBy('starts_at')
            ->take(10)
            ->get()
            ->map(function (Event $event): array {
                $confirmedCount = EventRegistration::query()
                    ->where('event_id', $event->id)
                    ->where('status', RegistrationStatus::Confirmed)
                    ->count();

                $available = $event->capacity
                    ? max(0, $event->capacity - $confirmedCount)
                    : null;

                $venueName = $event->venue_id
                    ? DB::table('venues')->where('id', $event->venue_id)->value('name')
                    : null;

                $roomName = $event->room_id
                    ? DB::table('rooms')->where('id', $event->room_id)->value('name')
                    : null;

                $location = collect([$venueName, $roomName])
                    ->filter()
                    ->implode(' — ');

                $categoryName = DB::table('event_category_event')
                    ->join('event_categories', 'event_category_event.category_id', '=', 'event_categories.id')
                    ->where('event_category_event.event_id', $event->id)
                    ->value('event_categories.name');

                return [
                    'title' => $event->title,
                    'starts_at' => $event->starts_at->toISOString(),
                    'ends_at' => $event->ends_at->toISOString(),
                    'slug' => $event->slug,
                    'available_spots' => $available,
                    'confirmed_count' => $confirmedCount,
                    'capacity' => $event->capacity,
                    'location' => $location ?: 'Por definir',
                    'category' => $categoryName ?? 'General',
                ];
            })
            ->values()
            ->toArray();

        $totalRegistrations = EventRegistration::query()
            ->whereIn('status', [RegistrationStatus::Confirmed, RegistrationStatus::Attended])
            ->whereHas('event', fn ($q) => $q->where('ends_at', '<', now()))
            ->count();

        $totalAttendances = DB::table('event_attendances')->count();

        $averageAttendance = $totalRegistrations > 0
            ? (int) round(($totalAttendances / $totalRegistrations) * 100)
            : 0;

        return [
            'eventsThisYear' => Event::query()
                ->whereYear('starts_at', $year)
                ->where('status', 'published')
                ->count(),

            'totalParticipants' => EventRegistration::query()
                ->where('status', RegistrationStatus::Confirmed)
                ->distinct('participant_id')
                ->count(),

            'totalCertificates' => DB::table('certificates')->count(),

            'nextEvent' => $nextEvent ? [
                'title' => $nextEvent->title,
                'starts_at' => $nextEvent->starts_at->toISOString(),
                'ends_at' => $nextEvent->ends_at->toISOString(),
            ] : null,

            'upcomingEvents' => $upcomingEvents,

            'averageAttendance' => $averageAttendance,
        ];
    }
}
