<?php

use App\Jobs\SendMagicLinkJob;
use App\Models\MagicLinkToken;
use App\Models\Participant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('magic link page is accessible', function () {
    $this->get(route('auth.magic-link.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/magic-link')
        );
});

test('magic link can be requested with valid email', function () {
    Queue::fake();

    $participant = Participant::factory()->create();

    $this->post(route('auth.magic-link.store'), [
        'email' => $participant->email,
    ])
        ->assertRedirect()
        ->assertSessionHas('status');

    $this->assertDatabaseHas('magic_link_tokens', [
        'email' => $participant->email,
    ]);

    Queue::assertPushed(SendMagicLinkJob::class, fn ($job) => $job->token->email === $participant->email
    );
});

test('magic link is rate limited', function () {
    $participant = Participant::factory()->create();

    for ($i = 0; $i < 5; $i++) {
        $this->post(route('auth.magic-link.store'), [
            'email' => $participant->email,
        ]);
    }

    $this->post(route('auth.magic-link.store'), [
        'email' => $participant->email,
    ])->assertTooManyRequests();
});

test('valid magic link authenticates participant', function () {
    $participant = Participant::factory()->create();

    $token = MagicLinkToken::create([
        'email' => $participant->email,
        'token' => Str::random(64),
        'expires_at' => now()->addMinutes(15),
        'created_at' => now(),
    ]);

    $this->get(route('auth.magic-link.verify', ['token' => $token->token]))
        ->assertRedirect(route('participant.dashboard'));

    $this->assertAuthenticated('participant');
});

test('expired magic link is rejected', function () {
    $participant = Participant::factory()->create();

    $token = MagicLinkToken::create([
        'email' => $participant->email,
        'token' => Str::random(64),
        'expires_at' => now()->subMinute(),
        'created_at' => now()->subMinutes(16),
    ]);

    $this->get(route('auth.magic-link.verify', ['token' => $token->token]))
        ->assertRedirect(route('auth.magic-link.show'))
        ->assertSessionHasErrors('email');
});

test('used magic link cannot be reused', function () {
    $participant = Participant::factory()->create();

    $token = MagicLinkToken::create([
        'email' => $participant->email,
        'token' => Str::random(64),
        'expires_at' => now()->addMinutes(15),
        'created_at' => now(),
        'used_at' => now(),
    ]);

    $this->get(route('auth.magic-link.verify', ['token' => $token->token]))
        ->assertRedirect(route('auth.magic-link.show'))
        ->assertSessionHasErrors('email');
});

test('invalid email is rejected when requesting magic link', function () {
    $this->post(route('auth.magic-link.store'), [
        'email' => 'not-an-email',
    ])->assertSessionHasErrors('email');
});

test('authenticated participant can visit dashboard', function () {
    $participant = Participant::factory()->create();

    $this->actingAs($participant, 'participant')
        ->get(route('participant.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('participant/dashboard')
        );
});

test('guest cannot visit participant dashboard', function () {
    $this->get(route('participant.dashboard'))
        ->assertRedirect(route('auth.magic-link.show'));
});
