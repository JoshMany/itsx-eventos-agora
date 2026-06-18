<?php

namespace Database\Seeders\Demo;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Super Admin', 'email' => 'superadmin@agora.test', 'role' => 'Super Admin'],
            ['name' => 'Administrador', 'email' => 'admin@agora.test', 'role' => 'Administrador'],
            ['name' => 'Coordinador ITSX', 'email' => 'coordinador@agora.test', 'role' => 'Coordinador'],
            ['name' => 'Organizador', 'email' => 'organizador@agora.test', 'role' => 'Organizador'],
        ];
        foreach ($users as $u) {
            $user = User::create(['name' => $u['name'], 'email' => $u['email'], 'password' => 'password', 'email_verified_at' => now()]);
            $user->assignRole($u['role']);
        }
    }
}
