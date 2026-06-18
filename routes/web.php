<?php

use App\Http\Controllers\Auth\MagicLinkController;
use App\Http\Controllers\Participants\ParticipantDashboardController;
use App\Http\Controllers\Participants\ParticipantRegistrationController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('home');

// Certificate public validation
Route::get('constancias/validar/{folio}', function (string $folio) {
    return Inertia\Inertia::render('public/validate-certificate', [
        'folio' => $folio,
    ]);
})->name('certificates.validate');

// Post-login redirect based on user roles
Route::middleware('auth')->get('/dashboard', function (Request $request) {
    $user = $request->user();

    if ($user->hasAnyRole(['Super Admin', 'Administrador', 'Coordinador', 'Organizador', 'Capturista', 'Validador', 'Consulta'])) {
        return redirect()->intended(route('admin.dashboard'));
    }

    return redirect()->intended(route('participant.dashboard'));
})->name('dashboard');

// Magic link authentication (public)
Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('acceso', [MagicLinkController::class, 'show'])->name('magic-link.show');
    Route::post('acceso', [MagicLinkController::class, 'store'])->name('magic-link.store')
        ->middleware('throttle:5,1');
    Route::get('acceso/verificar/{token}', [MagicLinkController::class, 'verify'])->name('magic-link.verify');
});

// Public participant registration (no auth required)
Route::post('registros', [ParticipantRegistrationController::class, 'store'])->name('participant.register');

// Authenticated participant dashboard
Route::middleware(['auth:participant'])->prefix('mi-espacio')->name('participant.')->group(function () {
    Route::get('/', [ParticipantDashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
