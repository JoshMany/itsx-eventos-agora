<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdministrationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/administration/index', [
            'sections' => [
                ['label' => 'Usuarios', 'href' => '/admin/administration/users', 'description' => 'Gestionar cuentas de staff'],
                ['label' => 'Roles', 'href' => '/admin/administration/roles', 'description' => 'Roles y permisos del sistema'],
                ['label' => 'Catálogos', 'href' => '/admin/administration/catalogs', 'description' => 'Configuración general'],
                ['label' => 'Auditoría', 'href' => '/admin/administration/audit', 'description' => 'Registro de actividad'],
            ],
        ]);
    }

    public function users(): Response
    {
        return Inertia::render('admin/administration/users', ['users' => DB::table('users')->paginate(20)]);
    }

    public function roles(): Response
    {
        return Inertia::render('admin/administration/roles', ['roles' => DB::table('roles')->get()]);
    }

    public function catalogs(): Response
    {
        return Inertia::render('admin/administration/catalogs');
    }

    public function audit(): Response
    {
        return Inertia::render('admin/administration/audit');
    }
}
