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
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();

            // Полиморфная связь: может быть у Product или у ProductVariant
            $table->morphs('imageable');

            $table->uuid('ms_id')->nullable()->index(); // Чтобы не дублировать при импорте
            $table->string('path'); // Путь в storage/app/public
            $table->integer('sort_order')->default(0);
            $table->boolean('is_main')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
