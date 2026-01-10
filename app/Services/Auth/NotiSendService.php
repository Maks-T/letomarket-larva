<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class NotiSendService
{
    protected string $apiKey;
    protected string $project;
    protected bool $isTest;
    protected string $apiUrl = 'https://sms.notisend.ru/api/message/send';

    public function __construct()
    {
        $this->apiKey = config('services.notisend.key');
        $this->project = config('services.notisend.project', 'letomarket'); // Из конфига
        $this->isTest = config('services.notisend.test_mode', false);
    }

    /**
     * Генерация 6-значного кода
     */
    public function generateCode(): string
    {
        // Для локалки или тестового режима
        if (app()->isLocal() || $this->isTest) {
            return '111111';
        }

        return (string) random_int(100000, 999999);
    }

    /**
     * Отправка сообщения
     */
    public function sendCode(string $phone, string $code): bool
    {
        // Тестовая подмена номера
        // Если вводим 7111...,
        if ($phone === '71111111111') {
            $phone = '375297434317';
        }

        // 2. Локальная заглушка
        if (app()->isLocal() || $this->isTest) {
            Log::info("[NotiSend MOCK] Phone: {$phone}, Code: {$code}");
            return true;
        }

        try {
            $response = Http::asJson()->post($this->apiUrl, [
                'project' => $this->project,
                'recipients' => $phone,
                'message' => "Ваш код подтверждения - {$code}",
                'apikey' => $this->apiKey,
                // 'test' => 1 // Раскомментировать, если нужно тестировать API без реальной отправки
            ]);

            $data = $response->json();

            if ($response->successful() && ($data['status'] ?? '') === 'success') {
                Log::info("[NotiSend] Sent to {$phone}");
                return true;
            }

            Log::error('NotiSend Error: ' . $response->body());
            return false;

        } catch (Exception $e) {
            Log::error('NotiSend Exception: ' . $e->getMessage());
            return false;
        }
    }
}
