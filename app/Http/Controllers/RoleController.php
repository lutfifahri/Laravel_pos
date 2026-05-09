<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use App\Services\RolePermissionService;
use Inertia\Inertia;

class RoleController extends Controller
{
    protected $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }

    public function index()
    {
        return Inertia::render('Master/Role/Index', [
            'roles' => $this->rolePermissionService->getAllRoles(),
            'permissions' => $this->rolePermissionService->getAllPermissions(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
        ]);

        $this->rolePermissionService->createRole($request->all());

        return redirect()->route('master.roles.index')->with('success', 'Role berhasil dibuat.');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $this->rolePermissionService->updateRole($role, $request->all());

        return redirect()->route('master.roles.index')->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'admin') {
            return back()->with('error', 'Role admin tidak bisa dihapus.');
        }

        $this->rolePermissionService->deleteRole($role);

        return redirect()->route('master.roles.index')->with('success', 'Role berhasil dihapus.');
    }
}
