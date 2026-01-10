<?php

namespace App\Services\Integration\MS;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MsClient
{
    protected string $baseUrl;
    protected string $token;

    public function __construct()
    {
        $this->baseUrl = config('services.ms.url', 'https://api.moysklad.ru/api/remap/1.2');
        $this->token = config('services.ms.token');
    }

    /**
     * Настройка HTTP клиента с Bearer Token
     */
    protected function makeRequest(): PendingRequest
    {
        return Http::withToken($this->token)
            ->baseUrl($this->baseUrl)
            ->withHeaders([
                'Accept-Encoding' => 'gzip', // Сжатие для скорости
                'Content-Type' => 'application/json',
            ])
            ->timeout(30)
            ->retry(3, 100);
    }

    /**
     * Универсальный GET с пагинацией (Генератор)
     */
    public function getAll(string $endpoint, array $params = []): \Generator
    {
        $limit = 100;
        $offset = 0;

        do {
            $params['limit'] = $limit;
            $params['offset'] = $offset;

            $response = $this->makeRequest()->get($endpoint, $params);

            if ($response->failed()) {
                Log::error("MS API Error [GET $endpoint]: " . $response->body());
                break;
            }

            $rows = $response->json('rows', []);
            $meta = $response->json('meta', []);
            $total = $meta['size'] ?? 0;

            foreach ($rows as $row) {
                yield $row;
            }

            $offset += $limit;

        } while ($offset < $total && count($rows) > 0);
    }
}
