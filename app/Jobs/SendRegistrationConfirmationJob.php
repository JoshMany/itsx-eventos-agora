<?php

namespace App\Jobs;

use App\Mail\RegistrationConfirmationMail;
use App\Models\EventRegistration;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendRegistrationConfirmationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly EventRegistration $registration) {}

    public function handle(): void
    {
        $this->registration->load('participant');

        Mail::to($this->registration->participant->email)
            ->send(new RegistrationConfirmationMail($this->registration));
    }
}
