<?php

namespace App\Mail;

use App\Models\MagicLinkToken;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MagicLinkMail extends Mailable
{
    use SerializesModels;

    public string $loginUrl;

    public function __construct(public readonly MagicLinkToken $token)
    {
        $this->loginUrl = route('auth.magic-link.verify', ['token' => $token->token]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Tu enlace de acceso a AGORA');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.magic-link');
    }

    public function attachments(): array
    {
        return [];
    }
}
