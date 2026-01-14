<?php

namespace App\Services\Integration\MS;

use App\Support\PhoneHelper;

class MsCounterpartyService extends MsClient
{
    /**
     * Продвинутый поиск физлица.
     * Ищем по точному совпадению email или по вхождению последних 10 цифр телефона.
     */
    public function findIndividual(string $login): ?array
    {
        $type = PhoneHelper::detectType($login);
        $filter = $type === 'email'
            ? "email=" . strtolower(trim($login))
            : "phone~" . PhoneHelper::forSearch($login);

        $response = $this->makeRequest()->get('entity/counterparty', [
            'filter' => "{$filter};companyType=individual",
            'limit' => 1
        ]);

        return $response->json('rows.0');
    }

    /**
     * Поиск Юрлица или ИП по ИНН (самый надежный способ для бизнеса)
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
     */
    public function createOrUpdate(array $data, ?string $msId = null): array
    {
        $endpoint = 'entity/counterparty';
        if ($msId) $endpoint .= '/' . $msId;

        // Формируем тело по стандартам МС
        $body = array_filter([
            'name' => $data['name'] ?? 'Новый клиент (сайт)',
            'companyType' => $data['companyType'] ?? 'individual',
            'email' => isset($data['email']) ? strtolower($data['email']) : null,
            'phone' => isset($data['phone']) ? PhoneHelper::normalize($data['data']) : null,
            'inn' => $data['inn'] ?? null,
            'kpp' => $data['kpp'] ?? null,
            'actualAddress' => $data['actual_address'] ?? null,
            'legalAddress' => $data['legal_address'] ?? null,
        ]);

        $request = $msId ? $this->makeRequest()->put($endpoint, $body) : $this->makeRequest()->post($endpoint, $body);

        return $request->throw()->json();
    }
}
