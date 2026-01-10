<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            // --- АВТОРИЗАЦИЯ ---
            $table->string('phone')->nullable();
            $table->string('phone_normalized', 20)->unique()->index();
            $table->string('email')->nullable()->unique();
            $table->string('password')->nullable();
            $table->rememberToken();

            // --- ЛИЧНЫЕ ДАННЫЕ ---
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender', 10)->nullable();

            // Адрес (было address_fact)
            $table->text('actual_address')->nullable()->comment('МС: actualAddress');

            // --- ИНТЕГРАЦИЯ С МС ---
            $table->uuid('ms_id')->nullable()->unique();
            $table->uuid('ms_price_type_uuid')->nullable();
            $table->uuid('ms_bonus_program_id')->nullable();

            // --- КЭШ ---
            $table->decimal('loyalty_balance', 10, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
