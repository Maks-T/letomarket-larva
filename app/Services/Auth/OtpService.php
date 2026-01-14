<?php

namespace App\Services\Auth;

use App\Support\PhoneHelper;
use App\Mail\AuthCodeMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OtpService
{
    // Время жизни кода (в секундах) - 5 минут
    protected const TTL = 300;

    // Префикс ключа в Redis
    protected const PREFIX = 'auth_otp:';

    // Внедряем зависимость NotiSendService
    public function __construct(
        protected NotiSendService $notiSend
    ) {}

    /**
     * Генерирует и сохраняет код
     */
    public function generate(string $identifier): string
    {
        $cacheKey = $this->getCacheKey($identifier);

        // Для локальной разработки или тестового режима всегда 111111
        // (Можно также проверять конфиг services.notisend.test_mode)
        $code = (app()->isLocal()) ? '111111' : (string) random_int(100000, 999999);

        // Сохраняем в кэш
        Cache::put($cacheKey, $code, self::TTL);

        //Временно логируем отправленные коды для тестов
        \Illuminate\Support\Facades\Log::channel('single')->info("OTP generated for {$identifier}: {$code}");

        return $code;
    }

    /**
     * Отправляет код (СМС или Email)
     */
    public function send(string $contact, string $code): bool
    {
        $type = PhoneHelper::detectType($contact);

        if ($type === 'phone') {
            // Отправка СМС через внедренный сервис NotiSend
            $phone = PhoneHelper::normalize($contact);
            return $this->notiSend->sendCode($phone, $code); // Используем метод sendCode, который мы писали ранее
        }

        // Отправка Email
        try {
            Mail::to($contact)->send(new AuthCodeMail($code));
            return true;
        } catch (\Exception $e) {
            Log::error("Email send error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Проверяет код и удаляет его при успехе
     */
    public function validate(string $identifier, string $code): bool
    {
        $cacheKey = $this->getCacheKey($identifier);

        $cachedCode = Cache::get($cacheKey);

        if ($cachedCode && (string)$cachedCode === (string)$code) {
            // Код верный -> удаляем его, чтобы нельзя было использовать повторно
            Cache::forget($cacheKey);
            return true;
        }

        return false;
    }

    /**
     * Вспомогательный метод для формирования ключа кэша.
     * Гарантирует, что ключ одинаковый и при генерации, и при проверке.
     */
    private function getCacheKey(string $identifier): string
    {
        $type = PhoneHelper::detectType($identifier);

        $normalized = $type === 'phone'
            ? PhoneHelper::normalize($identifier)
            : strtolower(trim($identifier)); // Email: нижний регистр + убрать пробелы

        return self::PREFIX . $normalized;
    }
}
