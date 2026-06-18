<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Certificate Type ↔ Activity Type Mapping
    |--------------------------------------------------------------------------
    |
    | Defines which certificate types are available depending on the activity
    | types present in an event. The '*' key lists certificate types that are
    | always available regardless of the event's activities.
    |
    | When an event has no activities, all certificate types are available.
    | When it has activities, only the union of matching types is shown.
    |
    */

    'map' => [
        '*' => [
            'attendance',
            'participation',
            'organizer',
            'volunteer',
            'recognition',
        ],

        'conference' => ['speaker'],
        'workshop' => ['speaker', 'workshop'],
        'course' => ['speaker', 'workshop'],
        'contest' => ['contest_winner'],
        'hackathon' => ['contest_winner'],
        'panel' => ['speaker'],
        'round_table' => ['speaker'],
        'seminar' => ['speaker'],
        'ceremony' => [],
    ],

];
