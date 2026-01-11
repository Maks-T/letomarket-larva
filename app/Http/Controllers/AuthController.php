<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginOrRegisterAction;
use App\Http\Requests\Auth\LoginPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\SendCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Models\Customer;
use App\Services\Auth\OtpService;
use App\Support\PhoneHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // ОТПРАВКА КОДА (AJAX)
    public function sendCode(SendCodeRequest $request, OtpService $otpService)
    {
        $login = $request->validated('login');

        $code = $otpService->generate($login);
        $sent = $otpService->send($login, $code);

        if (!$sent) {
            throw ValidationException::withMessages([
                'login' => 'Ошибка отправки кода. Проверьте данные или повторите позже.'
            ]);
        }

        return response()->json(['status' => 'ok', 'message' => 'Код отправлен']);
    }

    // ВХОД ПО КОДУ (INERTIA/AJAX)
    public function verifyCode(
        VerifyCodeRequest $request,
        OtpService $otpService,
        LoginOrRegisterAction $action
    ) {
        $login = $request->validated('login');
        $code = $request->validated('code');

        // Проверка кода в Redis
        if (!$otpService->validate($login, $code)) {
            throw ValidationException::withMessages([
                'code' => 'Неверный код или срок действия истек.'
            ]);
        }

        // Логика поиска/создания
        $customer = $action->execute($login);

        // Авторизация
        Auth::guard('web')->login($customer, true);
        $request->session()->regenerate();

        // Возвращаем редирект для Inertia
        return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]);
    }

    // ВХОД ПО ПАРОЛЮ
    public function loginPassword(LoginPasswordRequest $request)
    {
        $data = $request->validated();

        $type = PhoneHelper::detectType($data['login']);
        $column = $type === 'phone' ? 'phone_normalized' : 'email';

        // Попытка входа
        if (Auth::guard('web')->attempt([
            $column => $data['login'], // Здесь уже нормализованное значение из Request
            'password' => $data['password']
        ], true)) {
            $request->session()->regenerate();
            return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]);
        }

        throw ValidationException::withMessages([
            'password' => 'Неверный логин или пароль.'
        ]);
    }

    // СБРОС ПАРОЛЯ
    public function resetPassword(ResetPasswordRequest $request, OtpService $otpService)
    {
        $login = $request->validated('login');
        $code = $request->validated('code');
        $password = $request->validated('password');

        // 1. Проверяем код
        if (!$otpService->validate($login, $code)) {
            throw ValidationException::withMessages([
                'code' => 'Неверный код подтверждения.'
            ]);
        }

        // Ищем пользователя (сбрасывать пароль можно только существующему)
        $type = PhoneHelper::detectType($login);
        $column = $type === 'phone' ? 'phone_normalized' : 'email';

        $customer = Customer::where($column, $login)->first();

        if (!$customer) {
            throw ValidationException::withMessages([
                'login' => 'Пользователь не найден.'
            ]);
        }

        // Меняем пароль и входим
        $customer->update([
            'password' => Hash::make($password)
        ]);

        Auth::guard('web')->login($customer, true);
        $request->session()->regenerate();

        return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]);
    }

    // ВЫХОД
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
