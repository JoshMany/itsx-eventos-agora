<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdministrationController extends Controller
{
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
