<?php

namespace App\Services\Integration\MS;

use App\Support\ContactHelper;
use Illuminate\Http\Client\ConnectionException;

class MsCounterpartyService extends MsClient
{
    /**
     * Продвинутый поиск физлица.
     * Ищем по точному совпадению email или по вхождению последних 10 цифр телефона.
     * @throws ConnectionException
     */
    public function findIndividual(string $login): ?array
    {
        $type = ContactHelper::detectType($login);

        if ($type === ContactHelper::TYPE_EMAIL) {
            // Для email ищем точное совпадение
            $filter = "email=" . strtolower(trim($login));
        } else {
            // Для телефона нормализуем и берем последние 10 цифр для поиска через "~" (like)
            $normalized = ContactHelper::normalize($login);
            // Если номер длинный (7999...), берем 999..., если короткий - ищем как есть
            $searchPhone = strlen($normalized) >= 10 ? substr($normalized, -10) : $normalized;
            $filter = "phone~{$searchPhone}";
        }

        $response = $this->makeRequest()->get('entity/counterparty', [
            'filter' => "{$filter};companyType=individual",
            'limit' => 1
        ]);

        return $response->json('rows.0');
    }

    /**
     * Поиск Юрлица или ИП по ИНН (самый надежный способ для бизнеса)
     * @throws ConnectionException
     */
    public function findCompanyByInn(string $inn): ?array
    {
        $response = $this->makeRequest()->get('entity/counterparty', [
            'filter' => "inn={$inn}",
            'limit' => 1
        ]);

        return $response->json('rows.0');
    }

    /**
     * Метод создания/обновления контрагента
     * @throws ConnectionException|\Illuminate\Http\Client\RequestException
     */
    public function createOrUpdate(array $data, ?string $msId = null): array
    {
        $endpoint = 'entity/counterparty';
        if ($msId) {
            $endpoint .= '/' . $msId;
        }

        // Формируем тело по стандартам МС
        $body = [
            'name' => $data['name'] ?? 'Новый клиент (сайт)',
            'companyType' => $data['companyType'] ?? 'individual',
            'email' => isset($data['email']) ? strtolower(trim($data['email'])) : null,
            'phone' => isset($data['phone']) ? ContactHelper::normalize($data['phone']) : null,
            'inn' => $data['inn'] ?? null,
            'kpp' => $data['kpp'] ?? null,
            'actualAddress' => $data['actual_address'] ?? null,
            'legalAddress' => $data['legal_address'] ?? null,
        ];

        // Удаляем ключи с null значениями, чтобы не затереть данные в МС при обновлении (PATCH поведение)
        // Но при создании (POST) МС просто проигнорирует отсутствующие поля
        $body = array_filter($body, fn($value) => !is_null($value));

        $request = $msId
            ? $this->makeRequest()->put($endpoint, $body)
            : $this->makeRequest()->post($endpoint, $body);

        return $request->throw()->json();
    }
}
