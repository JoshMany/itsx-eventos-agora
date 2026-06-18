<?php

namespace App\Jobs;

use App\Mail\MagicLinkMail;
use App\Models\MagicLinkToken;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendMagicLinkJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly MagicLinkToken $token) {}

    public function handle(): void
    {
        Mail::to($this->token->email)->send(new MagicLinkMail($this->token));
    }
}
