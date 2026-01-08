<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; // Трейт от Shield

class User extends Authenticatable implements FilamentUser
{
  use HasApiTokens, HasFactory, Notifiable, HasRoles;

  protected $fillable = [
    'name',
    'email',
    'password',
  ];

  protected $hidden = [
    'password',
    'remember_token',
  ];

  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  /**
   * Контроль доступа к Админ-панели.
   * Мы возвращаем true, так как далее Filament Shield проверит права по ролям.
   * Если юзер заблокирован, здесь можно добавить проверку `return $this->is_active;`
   */
  public function canAccessPanel(Panel $panel): bool
  {
    return true;
  }
}