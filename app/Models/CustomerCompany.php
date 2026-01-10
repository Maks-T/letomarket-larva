<?php

namespace App\Models;

use App\Enums\CompanyType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerCompany extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    // Автоматическое преобразование строки из БД в Enum
    protected $casts = [
        'type' => CompanyType::class,
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    // Хелпер: Это ИП?
    public function isEntrepreneur(): bool
    {
        return $this->type === CompanyType::ENTREPRENEUR;
    }
}
