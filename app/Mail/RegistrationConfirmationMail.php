<?php

namespace App\Mail;

use App\Models\EventRegistration;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationConfirmationMail extends Mailable
{
    use SerializesModels;

    public function __construct(public readonly EventRegistration $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Confirmacion de registro AGORA');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.registration-confirmation');
    }

    public function attachments(): array
    {
        return [];
    }
}
