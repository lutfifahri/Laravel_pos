<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use App\Services\RolePermissionService;
use Inertia\Inertia;

class PermissionController extends Controller
{
    protected $rolePermissionService;

    public function __construct(RolePermissionService $rolePermissionService)
    {
        $this->rolePermissionService = $rolePermissionService;
    }

    public function index()
    {
        return Inertia::render('Master/Permission/Index', [
            'permissions' => $this->rolePermissionService->getAllPermissions(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $this->rolePermissionService->createPermission($request->all());

        return redirect()->route('master.permissions.index')->with('success', 'Permission berhasil dibuat.');
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $this->rolePermissionService->updatePermission($permission, $request->all());

        return redirect()->route('master.permissions.index')->with('success', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission)
    {
        $this->rolePermissionService->deletePermission($permission);

        return redirect()->route('master.permissions.index')->with('success', 'Permission berhasil dihapus.');
    }
}
