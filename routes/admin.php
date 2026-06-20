<?php

use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\AdministrationController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\AuditController;
use App\Http\Controllers\Admin\BudgetController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\RegistrationController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SpeakerController;
use App\Http\Controllers\Admin\SponsorController;
use App\Http\Controllers\Admin\SurveyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:Super Admin|Administrador|Coordinador|Organizador|Capturista|Validador|Consulta'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard', fn () => redirect()->route('admin.dashboard'));

    Route::resource('events', EventController::class)->except(['show'])->parameter('events', 'event');
    Route::get('events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::patch('events/{event}/status', [EventController::class, 'updateStatus'])->name('events.status');
    Route::patch('events/{event}/archive', [EventController::class, 'archive'])->name('events.archive');
    Route::patch('events/{event}/unarchive', [EventController::class, 'unarchive'])->name('events.unarchive');
    Route::delete('events/{event}/force', [EventController::class, 'forceDelete'])->name('events.force-delete');
    Route::patch('events/{event}/restore', [EventController::class, 'restore'])->name('events.restore');

    Route::resource('participants', ParticipantController::class)->except(['show'])->parameter('participants', 'participant');
    Route::get('participants/{participant}', [ParticipantController::class, 'show'])->name('participants.show');

    Route::prefix('events/{event}')->name('events.')->group(function () {
        Route::resource('activities', ActivityController::class)->parameter('activities', 'activity');
        Route::get('registrations', [RegistrationController::class, 'index'])->name('registrations.index');
        Route::post('registrations', [RegistrationController::class, 'store'])->name('registrations.store');
        Route::get('registrations/search', [RegistrationController::class, 'searchParticipants'])->name('registrations.search');
        Route::get('registrations/filter-criterias', [RegistrationController::class, 'filterCriterias'])->name('registrations.filter-criterias');
        Route::post('registrations/preview-filter', [RegistrationController::class, 'previewFilter'])->name('registrations.preview-filter');
        Route::post('registrations/bulk', [RegistrationController::class, 'bulkStore'])->name('registrations.bulk');
        Route::patch('registrations/{registration}/status', [RegistrationController::class, 'updateStatus'])->name('registrations.status');
        Route::delete('registrations/{registration}', [RegistrationController::class, 'destroy'])->name('registrations.destroy');
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');
        Route::delete('attendance/{attendance}', [AttendanceController::class, 'destroy'])->name('attendance.destroy');
        Route::get('certificates', [CertificateController::class, 'index'])->name('certificates.index');
        Route::post('certificates/generate', [CertificateController::class, 'generate'])->name('certificates.generate');
        Route::post('certificates/generate-bulk', [CertificateController::class, 'generateBulk'])->name('certificates.generate-bulk');
        Route::get('surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::get('budgets', [BudgetController::class, 'index'])->name('budgets.index');
        Route::post('budgets', [BudgetController::class, 'store'])->name('budgets.store');
        Route::patch('budgets/{budget}', [BudgetController::class, 'update'])->name('budgets.update');
        Route::post('expenses', [BudgetController::class, 'storeExpense'])->name('expenses.store');
        Route::patch('expenses/{expense}', [BudgetController::class, 'updateExpense'])->name('expenses.update');
        Route::delete('expenses/{expense}', [BudgetController::class, 'destroyExpense'])->name('expenses.destroy');
        Route::patch('expenses/{expense}/restore', [BudgetController::class, 'restoreExpense'])->name('expenses.restore');
        Route::get('sponsors', [SponsorController::class, 'index'])->name('sponsors.index');
        Route::post('sponsors', [SponsorController::class, 'store'])->name('sponsors.store');
        Route::patch('sponsors/{sponsor}', [SponsorController::class, 'update'])->name('sponsors.update');
        Route::delete('sponsors/{sponsor}', [SponsorController::class, 'destroy'])->name('sponsors.destroy');
        Route::get('speakers', [SpeakerController::class, 'index'])->name('speakers.index');
        Route::post('speakers', [SpeakerController::class, 'store'])->name('speakers.store');
        Route::patch('speakers/{speaker}', [SpeakerController::class, 'update'])->name('speakers.update');
        Route::delete('speakers/{speaker}', [SpeakerController::class, 'destroy'])->name('speakers.destroy');
    });

    Route::resource('certificates', CertificateController::class)->except(['show', 'create', 'store', 'edit', 'update', 'destroy']);
    Route::get('certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');

    Route::resource('surveys', SurveyController::class);
    Route::get('surveys/{survey}/results', [SurveyController::class, 'results'])->name('surveys.results');
    Route::patch('surveys/{survey}/restore', [SurveyController::class, 'restore'])->name('surveys.restore');

    Route::resource('sponsors', SponsorController::class)->except(['create', 'edit', 'show']);
    Route::resource('budgets', BudgetController::class)->except(['create', 'edit', 'show']);

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/{type}', [ReportController::class, 'show'])->name('reports.show');

    Route::prefix('administration')->name('administration.')->group(function () {
        Route::get('/', [AdministrationController::class, 'index'])->name('index');
        Route::get('users', [AdministrationController::class, 'users'])->name('users');
        Route::get('users/{user}/edit', [AdministrationController::class, 'editUser'])->name('users.edit');
        Route::patch('users/{user}/roles', [AdministrationController::class, 'updateUserRoles'])->name('users.roles');
        Route::get('roles', [AdministrationController::class, 'roles'])->name('roles');
        Route::get('roles/{role}/edit', [AdministrationController::class, 'editRole'])->name('roles.edit');
        Route::patch('roles/{role}', [AdministrationController::class, 'updateRole'])->name('roles.update');
        Route::get('catalogs', [AdministrationController::class, 'catalogs'])->name('catalogs');
        Route::post('catalogs', [AdministrationController::class, 'storeCatalog'])->name('catalogs.store');
        Route::patch('catalogs', [AdministrationController::class, 'updateCatalog'])->name('catalogs.update');
        Route::delete('catalogs', [AdministrationController::class, 'destroyCatalog'])->name('catalogs.destroy');
        Route::get('audit', [AuditController::class, 'index'])->name('audit');
    });
});
