<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\AuthenticateMagicLinkAction;
use App\Actions\Auth\SendMagicLinkAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendMagicLinkRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MagicLinkController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('auth/magic-link');
    }

    public function store(SendMagicLinkRequest $request, SendMagicLinkAction $action): RedirectResponse
    {
        $action->execute($request->validated()['email']);

        return back()->with('status', 'Te enviamos un enlace de acceso a tu correo electrónico.');
    }

    public function verify(string $token, AuthenticateMagicLinkAction $action): RedirectResponse
    {
        try {
            $action->execute($token);
        } catch (AuthenticationException) {
            return redirect()->route('auth.magic-link.show')
                ->withErrors(['email' => 'El enlace de acceso no es válido o ha expirado.']);
        }

        return redirect()->route('participant.dashboard');
    }
}
