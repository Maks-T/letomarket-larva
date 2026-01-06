<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateSuperAdminSeeder extends Seeder
{
  public function run(): void
  {
    // 0. Очищаем кэш прав, чтобы избежать ошибок при сидинге
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    // 1. Создаем пользователя (или находим, если уже есть)
    $user = User::firstOrCreate(
      ['email' => 'admin@letomarket.ru'],
      [
        'name' => 'Admin',
        'password' => Hash::make('leto111222'),
      ]
    );

    // 2. Создаем роль admin для гарда 'admin'
    $role = Role::firstOrCreate(
      ['name' => 'admin', 'guard_name' => 'admin']
    );

    // 3. Выдаем ВСЕ существующие права этой роли
    // Берем только права для гарда 'admin', чтобы не смешивать с клиентскими
    $permissions = Permission::where('guard_name', 'admin')->get();

    // Синхронизируем (привязываем) их к роли
    $role->syncPermissions($permissions);

    // 4. Выдаем роль пользователю
    $user->assignRole($role);
  }
}