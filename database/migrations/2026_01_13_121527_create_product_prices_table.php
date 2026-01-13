<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_prices', function (Blueprint $table) {
            $table->id();

            // Привязка к конкретному SKU (Варианту)
            $table->foreignId('product_variant_id')
                ->constrained('product_variants')
                ->cascadeOnDelete();

            // UUID типа цены из МоегоСклада (например, 277edaf5-815b...)
            // По этому полю мы будем искать цену для конкретного юзера
            $table->uuid('price_type_uuid')->index();

            // Значение цены (в рублях)
            $table->decimal('price', 15, 2);

            // Валюта (опционально, если есть валютные цены)
            // $table->uuid('currency_uuid')->nullable();
            $table->timestamps();

            // У одного варианта не может быть двух цен одного типа
            $table->unique(['product_variant_id', 'price_type_uuid'], 'variant_price_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_prices');
    }
};
