<?php

namespace App\Services;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionService
{
    // Roles
    public function getAllRoles()
    {
        return Role::with('permissions')->get();
    }

    public function createRole($data)
    {
        $role = Role::create(['name' => $data['name']]);
        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        return $role;
    }

    public function updateRole(Role $role, $data)
    {
        $role->update(['name' => $data['name']]);
        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        return $role;
    }

    public function deleteRole(Role $role)
    {
        return $role->delete();
    }

    // Permissions
    public function getAllPermissions()
    {
        return Permission::all();
    }

    public function createPermission($data)
    {
        return Permission::create(['name' => $data['name']]);
    }

    public function updatePermission(Permission $permission, $data)
    {
        return $permission->update(['name' => $data['name']]);
    }

    public function deletePermission(Permission $permission)
    {
        return $permission->delete();
    }
}
