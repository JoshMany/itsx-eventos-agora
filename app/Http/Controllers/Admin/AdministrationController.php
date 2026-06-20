<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
        $users = DB::table('users')
            ->select(['users.id', 'users.name', 'users.email', 'users.created_at'])
            ->selectRaw('COALESCE(string_agg(roles.name, \', \'), \'—\') as role_names')
            ->leftJoin('model_has_roles', function ($join) {
                $join->on('users.id', '=', 'model_has_roles.model_id')
                    ->where('model_has_roles.model_type', '=', User::class);
            })
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->groupBy('users.id')
            ->orderByDesc('users.created_at')
            ->paginate(20);

        return Inertia::render('admin/administration/users', [
            'users' => $users,
            'allRoles' => Role::all(['id', 'name']),
        ]);
    }

    public function editUser(string $id): Response
    {
        $user = DB::table('users')->find($id);
        $userModel = User::find($id);

        return Inertia::render('admin/administration/users-edit', [
            'user' => $user,
            'allRoles' => Role::all(['id', 'name']),
            'assignedRoles' => $userModel->roles->pluck('id'),
        ]);
    }

    public function updateUserRoles(Request $request, string $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $user->syncRoles($request->input('roles', []));

        return redirect()->back()->with('success', 'Roles actualizados.');
    }

    public function roles(): Response
    {
        return Inertia::render('admin/administration/roles', [
            'roles' => Role::with('permissions')->withCount('users')->get(),
        ]);
    }

    public function editRole(string $id): Response
    {
        $role = Role::with('permissions')->findOrFail($id);
        $allPermissions = Permission::all()->groupBy(function ($p) {
            return explode('.', $p->name)[0];
        });

        return Inertia::render('admin/administration/roles-edit', [
            'role' => $role,
            'permissionGroups' => $allPermissions,
            'assignedPermissions' => $role->permissions->pluck('id'),
        ]);
    }

    public function updateRole(Request $request, string $id): RedirectResponse
    {
        $role = Role::findOrFail($id);
        $role->syncPermissions($request->input('permissions', []));

        return redirect()->back()->with('success', 'Permisos actualizados.');
    }

    public function catalogs(): Response
    {
        return Inertia::render('admin/administration/catalogs', [
            'activityTypes' => DB::table('activity_types')->orderBy('name')->get(),
            'rooms' => DB::table('rooms')->orderBy('name')->get(),
            'tracks' => DB::table('tracks')->orderBy('name')->get(),
            'certificateTypes' => DB::table('certificate_types')->orderBy('name')->get(),
            'budgetCategories' => DB::table('budget_categories')->orderBy('name')->get(),
            'venues' => DB::table('venues')->orderBy('name')->get(),
        ]);
    }

    public function storeCatalog(Request $request): RedirectResponse
    {
        $table = $request->input('table');

        $data = $request->validate([
            'table' => 'required|in:activity_types,rooms,tracks,certificate_types,budget_categories,venues',
            'name' => [
                'required', 'string', 'max:255',
                function (string $attribute, mixed $value, callable $fail) use ($table) {
                    $exists = DB::table($table)->where('name', trim($value))->exists();
                    if ($exists) {
                        $fail('Ya existe un registro con ese nombre en este catálogo.');
                    }
                },
            ],
            'code' => [
                'nullable', 'string', 'max:100',
                function (string $attribute, mixed $value, callable $fail) use ($table) {
                    if (blank($value)) {
                        return;
                    }
                    $tablesWithCode = ['activity_types', 'certificate_types', 'budget_categories'];
                    if (in_array($table, $tablesWithCode, true)) {
                        $exists = DB::table($table)->where('code', trim($value))->exists();
                        if ($exists) {
                            $fail('Ya existe un registro con ese código en este catálogo.');
                        }
                    }
                },
            ],
            'description' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:1',
            'building' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        unset($data['table']);

        // Trim strings
        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
        }
        if (isset($data['code'])) {
            $data['code'] = trim($data['code']);
        }

        $data['created_at'] = now();
        $data['updated_at'] = now();

        try {
            DB::table($table)->insert($data);

            $catalogLabels = [
                'activity_types' => 'Tipo de Actividad',
                'rooms' => 'Sala',
                'tracks' => 'Eje Temático',
                'certificate_types' => 'Tipo de Constancia',
                'budget_categories' => 'Categoría de Presupuesto',
                'venues' => 'Sede',
            ];

            activity()
                ->event('created')
                ->withProperties(['table' => $table, 'data' => $data])
                ->log("Catálogo: creado '{$data['name']}' en ".($catalogLabels[$table] ?? $table));
        } catch (QueryException $e) {
            if ($e->getCode() === '23505') {
                return redirect()->back()->with('error', 'No se puede guardar: ya existe un registro duplicado en este catálogo.');
            }

            throw $e;
        }

        return redirect()->back()->with('success', 'Registro agregado.');
    }

    public function updateCatalog(Request $request): RedirectResponse
    {
        $table = $request->input('table');
        $id = $request->input('id');

        $data = $request->validate([
            'table' => 'required|in:activity_types,rooms,tracks,certificate_types,budget_categories,venues',
            'id' => 'required|integer|exists:'.$table.',id',
            'name' => [
                'required', 'string', 'max:255',
                function (string $attribute, mixed $value, callable $fail) use ($table, $id) {
                    $exists = DB::table($table)
                        ->where('name', trim($value))
                        ->where('id', '!=', $id)
                        ->exists();
                    if ($exists) {
                        $fail('Ya existe otro registro con ese nombre en este catálogo.');
                    }
                },
            ],
            'code' => [
                'nullable', 'string', 'max:100',
                function (string $attribute, mixed $value, callable $fail) use ($table, $id) {
                    if (blank($value)) {
                        return;
                    }
                    $tablesWithCode = ['activity_types', 'certificate_types', 'budget_categories'];
                    if (in_array($table, $tablesWithCode, true)) {
                        $exists = DB::table($table)
                            ->where('code', trim($value))
                            ->where('id', '!=', $id)
                            ->exists();
                        if ($exists) {
                            $fail('Ya existe otro registro con ese código en este catálogo.');
                        }
                    }
                },
            ],
            'description' => 'nullable|string|max:1000',
            'capacity' => 'nullable|integer|min:1',
            'building' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        unset($data['id'], $data['table']);

        // Trim strings
        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
        }
        if (isset($data['code'])) {
            $data['code'] = trim($data['code']);
        }

        $data['updated_at'] = now();

        try {
            DB::table($table)->where('id', $id)->update($data);

            $catalogLabels = [
                'activity_types' => 'Tipo de Actividad',
                'rooms' => 'Sala',
                'tracks' => 'Eje Temático',
                'certificate_types' => 'Tipo de Constancia',
                'budget_categories' => 'Categoría de Presupuesto',
                'venues' => 'Sede',
            ];

            activity()
                ->event('updated')
                ->withProperties(['table' => $table, 'id' => $id, 'data' => $data])
                ->log("Catálogo: actualizado '{$data['name']}' en ".($catalogLabels[$table] ?? $table));
        } catch (QueryException $e) {
            if ($e->getCode() === '23505') {
                return redirect()->back()->with('error', 'No se puede guardar: ya existe un registro duplicado en este catálogo.');
            }

            throw $e;
        }

        return redirect()->back()->with('success', 'Registro actualizado.');
    }

    public function destroyCatalog(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'table' => 'required|in:activity_types,rooms,tracks,certificate_types,budget_categories,venues',
            'id' => 'required|integer|exists:'.$request->input('table').',id',
        ]);

        try {
            $record = DB::table($data['table'])->where('id', $data['id'])->first();
            DB::table($data['table'])->where('id', $data['id'])->delete();

            $catalogLabels = [
                'activity_types' => 'Tipo de Actividad',
                'rooms' => 'Sala',
                'tracks' => 'Eje Temático',
                'certificate_types' => 'Tipo de Constancia',
                'budget_categories' => 'Categoría de Presupuesto',
                'venues' => 'Sede',
            ];

            $recordName = $record?->name ?? $data['id'];

            activity()
                ->event('deleted')
                ->withProperties(['table' => $data['table'], 'id' => $data['id'], 'name' => $recordName])
                ->log("Catálogo: eliminado '{$recordName}' de ".($catalogLabels[$data['table']] ?? $data['table']));
        } catch (QueryException $e) {
            if ($e->getCode() === '23503') {
                return redirect()->back()->with('error', 'No se puede eliminar: este registro está en uso por otros elementos del sistema.');
            }

            throw $e;
        }

        return redirect()->back()->with('success', 'Registro eliminado.');
    }
}
