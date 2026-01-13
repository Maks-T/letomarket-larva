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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Связь с МС (это UUID товара-родителя или простого товара)
            $table->uuid('ms_id')->nullable()->unique();

            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('article')->nullable()->index(); // Артикул
            $table->string('code')->nullable(); // Код

            $table->text('description')->nullable();

            // Логика отображения
            $table->boolean('has_variants')->default(false)->comment('Есть ли выбор SKU');
            $table->boolean('is_active')->default(true);

            // Кэш цены для сортировки "от X рублей"
            $table->decimal('min_price', 15, 2)->default(0);

            $table->timestamps();
        });

        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attribute_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attribute_value_id')->constrained()->cascadeOnDelete();

            // Индексы для быстрого фильтра
            $table->index(['attribute_id', 'attribute_value_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('products');
    }
};
