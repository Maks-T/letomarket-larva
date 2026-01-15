<?php

namespace App\Services\Auth;

use App\Support\ContactHelper;
use App\Mail\AuthCodeMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Random\RandomException;

class OtpService
{
    // Время жизни кода (в секундах) - 5 минут
    protected const int TTL = 300;

    // Префикс ключа в Redis
    protected const string PREFIX = 'auth_otp:';

    public function __construct(
        protected NotiSendService $notiSend
    )
    {
    }

    /**
     * Генерирует и сохраняет код
     * @throws RandomException
     */
    public function generate(string $identifier): string
    {
        $cacheKey = $this->getCacheKey($identifier);

        // Для локальной разработки или тестового режима всегда 111111
        $code = (app()->isLocal()) ? '111111' : (string)random_int(100000, 999999);

        // Сохраняем в кэш
        Cache::put($cacheKey, $code, self::TTL);

        // Логируем для отладки
        Log::channel('single')->info("OTP generated for {$identifier}: {$code}");

        return $code;
    }

    /**
     * Отправляет код (СМС или Email)
     */
    public function send(string $contact, string $code): bool
    {
        $type = ContactHelper::detectType($contact);

        if ($type === ContactHelper::TYPE_PHONE) {
            $phone = ContactHelper::normalize($contact);
            return $this->notiSend->sendCode($phone, $code);
        }

        // Отправка Email
        try {
            Mail::to(trim($contact))->send(new AuthCodeMail($code));
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
            Cache::forget($cacheKey);
            return true;
        }

        return false;
    }

    /**
     * Вспомогательный метод для формирования ключа кэша.
     */
    private function getCacheKey(string $identifier): string
    {
        return self::PREFIX . ContactHelper::normalize($identifier);
    }
}
