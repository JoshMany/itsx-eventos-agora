<?php

namespace App\Actions\Auth;

use App\Models\MagicLinkToken;
use App\Models\Participant;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

class AuthenticateMagicLinkAction
{
    /**
     * @throws AuthenticationException
     */
    public function execute(string $token): Participant
    {
        $magicLink = MagicLinkToken::where('token', $token)->first();

        if (! $magicLink || ! $magicLink->isValid()) {
            throw new AuthenticationException('El enlace de acceso no es válido o ha expirado.');
        }

        $magicLink->update(['used_at' => now()]);

        $participant = Participant::firstOrCreate(
            ['email' => $magicLink->email],
            [
                'type' => 'external',
                'first_name' => '',
                'last_name' => '',
            ],
        );

        Auth::guard('participant')->login($participant);

        return $participant;
    }
}
