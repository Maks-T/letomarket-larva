<?php

namespace App\Services\Integration\MS;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class MsReferenceService extends MsClient
{
    /**
     * Получить список Типов Цен [UUID => Название]
     * Кэшируем на 24 часа
     */
    public function getPriceTypes(): array
    {
        return Cache::remember('ms_price_types', 86400, function () {
            // Эндпоинт возвращает плоский массив, а не "rows"
            // Поэтому используем makeRequest()->get() напрямую
            $response = $this->makeRequest()->get('context/companysettings/pricetype');

            if ($response->failed()) {
                Log::error("MS API Error [PriceTypes]: " . $response->body());
                return [];
            }

            $types = [];
            $data = $response->json();

            foreach ($data as $type) {
                $uuid = $type['id'];
                $types[$uuid] = $type['name'];
            }

            return $types;
        });
    }
}
