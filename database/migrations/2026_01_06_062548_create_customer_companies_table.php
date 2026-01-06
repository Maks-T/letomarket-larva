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
    Schema::create('customer_companies', function (Blueprint $table) {
      $table->id();

      // Связь с аккаунтом
      $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

      // Интеграция с МС (Юрлицо)
      $table->uuid('ms_id')->nullable()->unique()->comment('ID Контрагента-юрлица в МС');

      // Основные реквизиты
      $table->string('title')->comment('Внутреннее название (Моё ООО)');
      $table->string('name')->comment('Официальное название (ООО Ромашка)');
      $table->string('inn', 12)->index();
      $table->string('kpp', 9)->nullable();

      // Адреса
      $table->string('address_legal')->nullable()->comment('Юридический адрес');
      $table->string('address_fact')->nullable()->comment('Фактический адрес (для доставки)');

      // Банковские реквизиты (Базовые)
      $table->string('bank_name')->nullable();
      $table->string('bik', 9)->nullable();
      $table->string('account_number', 20)->nullable()->comment('Расчетный счет');
      $table->string('corr_account', 20)->nullable()->comment('Корреспондентский счет');

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('customer_companies');
  }
};
