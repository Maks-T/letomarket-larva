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
    Schema::create('loyalty_transactions', function (Blueprint $table) {
      $table->id();
      $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

      // Сумма операции (+100.00 или -50.00)
      $table->decimal('amount', 10, 2);

      // Тип операции
      // 'earn' (начисление), 'spend' (списание), 'adjustment' (корректировка), 'sync' (синхронизация)
      $table->string('type')->index();

      // Описание для клиента
      $table->string('description')->nullable();

      // Мета-данные (JSON) для связи с внешними системами
      // Пример: {"order_id": 123, "ms_bonus_transaction_id": "uuid..."}
      $table->json('meta')->nullable();

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('loyalty_transactions');
  }
};
