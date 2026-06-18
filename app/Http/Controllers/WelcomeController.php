<?php

namespace App\Http\Controllers;

use App\Actions\Events\GetHomeStatsAction;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke(GetHomeStatsAction $action)
    {
        return Inertia::render('welcome', [
            'stats' => Inertia::defer(fn () => $action->execute()),
        ]);
    }
}
