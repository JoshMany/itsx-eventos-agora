<?php

namespace Database\Seeders\Catalog;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'events.view', 'events.create', 'events.update', 'events.delete', 'events.publish',
            'activities.view', 'activities.create', 'activities.update', 'activities.delete',
            'participants.view', 'participants.create', 'participants.update',
            'registrations.view', 'registrations.manage', 'attendance.checkin',
            'certificates.generate', 'certificates.download', 'certificates.validate',
            'surveys.view', 'surveys.create', 'surveys.manage',
            'budgets.view', 'budgets.create', 'budgets.update', 'budgets.delete', 'budgets.submit', 'budgets.approve', 'budgets.export',
            'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete',
            'sponsors.view', 'sponsors.manage',
            'reports.view', 'reports.export',
            'notifications.send', 'notifications.manage',
            'settings.view', 'settings.manage',
            'users.view', 'users.create', 'users.update', 'users.delete',
            'roles.view', 'roles.manage',
        ];
        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }

        $superAdmin = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::create(['name' => 'Administrador', 'guard_name' => 'web']);
        $admin->givePermissionTo(Permission::all());

        $coord = Role::create(['name' => 'Coordinador', 'guard_name' => 'web']);
        $coord->givePermissionTo([
            'events.view', 'events.create', 'events.update', 'events.publish',
            'activities.view', 'activities.create', 'activities.update',
            'participants.view', 'registrations.view', 'registrations.manage',
            'attendance.checkin',
            'certificates.generate', 'certificates.download',
            'surveys.view',
            'budgets.view', 'budgets.create', 'budgets.update', 'budgets.submit', 'budgets.export',
            'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete',
            'reports.view', 'reports.export',
        ]);

        $org = Role::create(['name' => 'Organizador', 'guard_name' => 'web']);
        $org->givePermissionTo([
            'events.view', 'events.create', 'events.update',
            'activities.view', 'activities.create', 'activities.update',
            'participants.view', 'registrations.view', 'registrations.manage',
            'attendance.checkin',
            'certificates.generate',
            'surveys.view',
            'budgets.view', 'expenses.view',
        ]);

        Role::create(['name' => 'Capturista', 'guard_name' => 'web'])->givePermissionTo(['events.view', 'activities.view', 'participants.view', 'registrations.view', 'registrations.manage', 'attendance.checkin', 'certificates.generate', 'surveys.view', 'expenses.view', 'expenses.create']);
        Role::create(['name' => 'Validador', 'guard_name' => 'web'])->givePermissionTo(['events.view', 'activities.view', 'participants.view', 'certificates.validate', 'surveys.view', 'budgets.view', 'expenses.view']);
        Role::create(['name' => 'Consulta', 'guard_name' => 'web'])->givePermissionTo(['events.view', 'activities.view', 'participants.view', 'registrations.view', 'certificates.validate', 'surveys.view', 'budgets.view', 'expenses.view', 'reports.view']);
    }
}
