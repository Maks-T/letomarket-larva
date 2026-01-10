<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            // Интеграция
            $table->uuid('ms_id')->nullable()->unique();
            $table->string('type')->default('legal'); // Enum: legal, entrepreneur

            // Реквизиты
            $table->string('title');
            $table->string('inn', 12)->index();
            $table->string('kpp', 9)->nullable();
            $table->string('ogrn', 15)->nullable();

            // Адреса (Переименовано)
            $table->string('legal_address')->nullable()->comment('МС: legalAddress');
            $table->string('actual_address')->nullable()->comment('МС: actualAddress');

            // Банк
            $table->string('bank_name')->nullable();
            $table->string('bik', 9)->nullable();
            $table->string('account_number', 25)->nullable();
            $table->string('corr_account', 25)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_companies');
    }
};
