<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginOrRegisterAction;
use App\Http\Requests\Auth\LoginPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\SendCodeRequest;
use App\Http\Requests\Auth\VerifyCodeRequest;
use App\Models\Customer;
use App\Services\Auth\OtpService;
use App\Support\ContactHelper;
use App\Support\PhoneHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Random\RandomException;
use Illuminate\Routing\Redirector;
use Illuminate\Http\RedirectResponse;

class AuthController extends Controller
{
    /**
     * Отправка кода
     * @throws ValidationException|RandomException
     */
    public function sendCode(SendCodeRequest $request, OtpService $otpService): JsonResponse
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


    /**
     * Проверка кода
     * @throws ValidationException
     */
    public function verifyCode(
        VerifyCodeRequest     $request,
        OtpService            $otpService,
        LoginOrRegisterAction $action
    ): JsonResponse
    {
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
        return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]); //ToDo добавить обработать редирект
    }


    /**
     * Вход по паролю
     * @throws ValidationException
     */
    public function loginPassword(LoginPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $login = $data['login'];

        // Определяем, по какой колонке искать пользователя
        $type = ContactHelper::detectType($login);
        $column = $type === ContactHelper::TYPE_PHONE ? 'phone_normalized' : 'email';

        // Попытка входа
        if (Auth::guard('web')->attempt([
            $column => $login,
            'password' => $data['password']
        ], true)) {
            $request->session()->regenerate();
            return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]);  //ToDo добавить обработать редирект
        }

        throw ValidationException::withMessages([
            'password' => 'Неверный логин или пароль.'
        ]);
    }

    /**
     * Сброс и установка нового пароля
     * @throws ValidationException
     */
    public function resetPassword(ResetPasswordRequest $request, OtpService $otpService): JsonResponse
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

        // 2. Ищем пользователя
        $type = ContactHelper::detectType($login);
        $column = $type === ContactHelper::TYPE_PHONE ? 'phone_normalized' : 'email';

        $customer = Customer::where($column, $login)->first();

        if (!$customer) {
            throw ValidationException::withMessages([
                'login' => 'Пользователь не найден.'
            ]);
        }

        // 3. Меняем пароль
        $customer->update([
            'password' => Hash::make($password)
        ]);

        // 4. Авторизуем
        Auth::guard('web')->login($customer, true);
        $request->session()->regenerate();

        return response()->json(['status' => 'ok', 'redirect' => route('cabinet.profile')]);
    }


    /**
     * Выход из аккаунта
     * @param Request $request
     * @return Redirector|RedirectResponse
     */
    public function logout(Request $request): Redirector|RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
