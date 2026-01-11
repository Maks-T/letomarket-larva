<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;


// Главная
Route::get('/', HomeController::class)->name('home');

// Группа для ГОСТЕЙ (Вход)
Route::middleware('guest:web')->group(function () {
    // Вход: Отправка кода (шаг 1)
    Route::post('/auth/send-code', [AuthController::class, 'sendCode'])->name('auth.send-code');

    // Вход: Проверка кода и вход (шаг 2)
    Route::post('/auth/verify-code', [AuthController::class, 'verifyCode'])->name('auth.verify');

    // Вход: По паролю
    Route::post('/auth/login-password', [AuthController::class, 'loginPassword'])->name('auth.login-password');

    // Сброс пароля (установка нового)
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
});

// Группа для АВТОРИЗОВАННЫХ (Личный кабинет)
Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Профиль (Заглушка)
    Route::get('/cabinet', function () {
        return Inertia::render('Cabinet/Profile', [
            'user' => auth()->user()
        ]);
    })->name('cabinet.profile');
});
