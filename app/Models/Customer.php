<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  protected $fillable = [
    'phone', 'email', 'password',
    'first_name', 'last_name',
    'ms_id', 'ms_price_type', 'loyalty_balance',
    'main_role'
  ];

  protected $hidden = [
    'password', 'remember_token',
  ];

  protected function casts(): array
  {
    return [
      'password' => 'hashed',
      'loyalty_balance' => 'decimal:2',
    ];
  }

  // Связи
  public function companies(): HasMany
  {
    return $this->hasMany(CustomerCompany::class);
  }

  public function loyaltyTransactions(): HasMany
  {
    return $this->hasMany(LoyaltyTransaction::class)->latest();
  }
}