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
    Schema::create('customers', function (Blueprint $table) {
      $table->id();

      // 1. Учетные данные
      $table->string('phone')->unique()->comment('Логин');
      $table->string('email')->nullable()->unique();
      $table->string('password');
      $table->rememberToken();

      // 2. Контактное лицо (ФИО)
      $table->string('first_name');
      $table->string('last_name')->nullable();

      // 3. Интеграция с МС (Физлицо)
      $table->uuid('ms_id')->nullable()->unique()->comment('ID Контрагента-физлица в МС');
      $table->string('ms_price_type')->nullable()->comment('Название типа цены (Розница, Опт, Дилер)');

      // 4. Лояльность (Кэш баланса)
      $table->decimal('loyalty_balance', 10, 2)->default(0);

      // 5. Системные метки
      // Помогает фронтенду понять, показывать ли B2B интерфейс по умолчанию
      $table->enum('main_role', ['b2c', 'b2b'])->default('b2c');

      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('customers');
  }
};
