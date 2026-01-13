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
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->uuid('ms_id')->nullable()->index(); // ID доп. поля в МС
            $table->string('name'); // "Бренд", "Материал"
            $table->string('type')->default('string'); // string, customentity, boolean...
            $table->boolean('is_filterable')->default(false); // Показывать в фильтре?
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
