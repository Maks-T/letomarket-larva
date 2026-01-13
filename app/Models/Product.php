<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model {
    protected $guarded = ['id'];

    protected $casts = [
        'has_variants' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2', // Виртуальное поле
    ];

    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function variants(): HasMany { return $this->hasMany(ProductVariant::class); }

    // Главный вариант (для простых товаров)
    public function mainVariant(): HasOne {
        return $this->hasOne(ProductVariant::class)->where('is_main', true);
    }

    // Фильтры
    public function attributeValues(): BelongsToMany {
        return $this->belongsToMany(AttributeValue::class, 'product_attribute_values');
    }

    public function images(): MorphMany {
        return $this->morphMany(ProductImage::class, 'imageable')->orderBy('sort_order');
    }
}
