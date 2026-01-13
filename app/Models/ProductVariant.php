<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ProductVariant extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'characteristics' => 'array',
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'is_main' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(ProductImage::class, 'imageable')->orderBy('sort_order');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }

    /**
     * Умный метод получения цены
     * Если передан клиент с особым типом цены - ищем его.
     * Если нет - возвращаем базовую цену.
     */
    public function getPriceFor(?Customer $customer): float
    {
        // 1. Если клиент не авторизован или у него нет спец. типа цены
        if (!$customer || !$customer->ms_price_type_uuid) {
            return (float) $this->price; // Базовая (Розничная)
        }

        // 2. Ищем спец. цену в коллекции (которую лучше подгружать через with('prices'))
        $personalPrice = $this->prices
            ->where('price_type_uuid', $customer->ms_price_type_uuid)
            ->first();

        // 3. Если нашли - возвращаем её, иначе базовую
        return $personalPrice ? (float) $personalPrice->price : (float) $this->price;
    }
}
