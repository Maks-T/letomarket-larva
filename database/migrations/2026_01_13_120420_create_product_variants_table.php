<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            // Если товар простой: здесь UUID Товара из МС.
            // Если вариативный: здесь UUID Модификации из МС.
            $table->uuid('ms_id')->nullable()->unique();

            $table->string('name'); // "Диван (Красный)"
            $table->string('sku')->nullable(); // Артикул модификации
            $table->string('barcode')->nullable(); // Штрихкод

            // Деньги
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('old_price', 15, 2)->nullable();
            $table->decimal('buy_price', 15, 2)->nullable();

            // Склад
            $table->integer('stock')->default(0);

            // Флаг "Главный вариант" (скрытый вариант простого товара)
            $table->boolean('is_main')->default(false);

            // Характеристики для выбора в интерфейсе (JSON проще)
            // Пример: {"Цвет": "Белый", "Размер": "L"}
            $table->json('characteristics')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
