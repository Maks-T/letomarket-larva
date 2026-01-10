<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            // UUID транзакции в МоемСкладе (чтобы избегать дублей)
            $table->uuid('ms_id')->nullable()->unique();

            // Ссылка на документ-основание (Заказ или Продажа)
            $table->uuid('ms_document_id')->nullable();

            // Сумма (+ или -)
            $table->decimal('amount', 10, 2);

            // Тип: EARN (начисление), SPEND (списание)
            $table->string('type')->index()->nullable();

            $table->string('description')->nullable();

            // Храним весь JSON от МС
            $table->json('meta')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
    }
};
