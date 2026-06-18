<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            Catalog\RolesAndPermissionsSeeder::class,
            Catalog\ParticipantRolesSeeder::class,
            Catalog\ActivityTypesSeeder::class,
            Catalog\EventCategoriesSeeder::class,
            Catalog\TagsSeeder::class,
            Catalog\CertificateTypesSeeder::class,
            Catalog\BudgetCategoriesSeeder::class,
            Institutional\OrganizationsSeeder::class,
            Institutional\VenuesAndRoomsSeeder::class,
            Institutional\CertificateTemplatesSeeder::class,
            Demo\UsersSeeder::class,
            Demo\ParticipantsSeeder::class,
            Demo\EventsSeeder::class,
            Demo\RegistrationsSeeder::class,
            Demo\AttendancesSeeder::class,
            Demo\SurveysSeeder::class,
            Demo\SurveyResponsesSeeder::class,
            Demo\SponsorsSeeder::class,
            Demo\EventSponsorsSeeder::class,
            Demo\EventBudgetsSeeder::class,
            Demo\CertificatesSeeder::class,
        ]);
    }
}
