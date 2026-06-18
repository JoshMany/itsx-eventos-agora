<?php

namespace App\Actions\Auth;

use App\Jobs\SendMagicLinkJob;
use App\Models\MagicLinkToken;
use Illuminate\Support\Str;

class SendMagicLinkAction
{
    public function execute(string $email): void
    {
        MagicLinkToken::where('email', $email)
            ->whereNull('used_at')
            ->delete();

        $token = MagicLinkToken::create([
            'email' => $email,
            'token' => Str::random(64),
            'expires_at' => now()->addMinutes(15),
            'created_at' => now(),
        ]);

        SendMagicLinkJob::dispatch($token)->onQueue('notifications');
    }
}
