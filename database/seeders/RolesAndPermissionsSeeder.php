<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
  public function run(): void
  {
    // 1. Сбрасываем кэш прав, чтобы не было ошибок
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    // 2. Определяем наш гард (как договаривались)
    $guard = 'admin';

    // =====================================================================
    // РОЛЬ: Менеджер продаж (Sales Manager)
    // =====================================================================
    $salesManager = Role::firstOrCreate(['name' => 'sales_manager', 'guard_name' => $guard]);

    // Выдаем права этому менеджеру
    $this->givePermissionsToRole($salesManager, [
      // Заказы: Видеть, менять статус, но НЕ удалять
      'order' => ['view', 'view_any', 'update'],

      // Клиенты: Видеть, править
      'customer' => ['view', 'view_any', 'update'],

      // Товары: ТОЛЬКО смотреть (чтобы видеть наличие/цены)
      'product' => ['view', 'view_any'],

      // Бонусы: Начислять вручную (Create)
      'loyalty_transaction' => ['view', 'view_any', 'create'],
    ]);

    // =====================================================================
    // РОЛЬ: Контент-менеджер (Content Manager)
    // =====================================================================
    $contentManager = Role::firstOrCreate(['name' => 'content_manager', 'guard_name' => $guard]);

    $this->givePermissionsToRole($contentManager, [
      // Товары: Править описание (Update), но не создавать/удалять (синхрон с МС)
      'product' => ['view', 'view_any', 'update'],

      // Блог/Статьи/Кейсы: Полный доступ
      // (Замените 'article', если ресурс называется Blog или Post)
      'article' => ['view', 'view_any', 'create', 'update', 'delete'],
      'portfolio' => ['view', 'view_any', 'create', 'update', 'delete'],

      // Пользователи: Не видит вообще
      'user' => [],
      'order' => [],
    ]);

    $this->command->info('Roles and Permissions seeded successfully!');
  }

  /**
   * Магическая функция для быстрой выдачи прав.
   * Превращает ['order' => ['view']] в разрешение 'view_order'
   */
  private function givePermissionsToRole(Role $role, array $resources): void
  {
    foreach ($resources as $resource => $actions) {
      foreach ($actions as $action) {
        // Формируем имя права в стиле Shield: view_product, update_order
        $permissionName = "{$action}_{$resource}";

        // Ищем право в БД. Если Shield еще не сгенерировал его — пропускаем, чтобы не упало.
        $permission = Permission::where('name', $permissionName)
          ->where('guard_name', $role->guard_name)
          ->first();

        if ($permission) {
          $role->givePermissionTo($permission);
        } else {
          // Опционально: можно создать право на лету, но лучше сначала запустить shield:generate
          $this->command->warn("Permission '{$permissionName}' not found. Did you run shield:generate?");
        }
      }
    }
  }
}