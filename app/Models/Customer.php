<?php

namespace App\Models;

use App\Support\PhoneHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'phone',
        'phone_normalized',
        'email',
        'password',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'actual_address',
        'ms_id',
        'ms_price_type_uuid',
        'ms_bonus_program_id',
        'loyalty_balance',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'loyalty_balance' => 'decimal:2',
            'birth_date' => 'date',
        ];
    }

    /**
     * Автоматически нормализует телефон при сохранении
     */
    public function setPhoneAttribute($value): void
    {
        $this->attributes['phone'] = $value;
        $this->attributes['phone_normalized'] = PhoneHelper::normalize($value);
    }

    // СВЯЗИ
    public function companies(): HasMany
    {
        return $this->hasMany(CustomerCompany::class);
    }

    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class)->latest();
    }
}
