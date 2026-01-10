<?php

namespace App\Services\Integration\MS;

use App\Support\PhoneHelper;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

class MsCounterpartyService extends MsClient
{
    /**
     * Универсальный поиск Физлица (по телефону ИЛИ email)
     * @param string $login Введенный пользователем логин (email или телефон)
     */
    public function findIndividual(string $login): ?array
    {
        // Простая проверка: если есть @ - это email
        if (str_contains($login, '@')) {
            return $this->findIndividualByEmail($login);
        }

        return $this->findIndividualByPhone($login);
    }

    /**
     * Поиск Физлица по телефону
     */
    public function findIndividualByPhone(string $phone): ?array
    {
        // Используем PhoneHelper только здесь, так как мы уверены, что это телефон
        $searchPhone = PhoneHelper::forSearch($phone);

        // Фильтр: телефон содержит цифры И тип = физлицо
        $response = $this->makeRequest()->get('entity/counterparty', [
            'filter' => "phone~{$searchPhone};companyType=individual",
            'limit' => 1
        ]);

        return $response->json('rows.0');
    }

    /**
     * Поиск Физлица по Email
     */
    public function findIndividualByEmail(string $email): ?array
    {
        // Для email используем строгое соответствие (=), чтобы не найти похожие
        $response = $this->makeRequest()->get('entity/counterparty', [
            'filter' => "email={$email};companyType=individual",
            'limit' => 1
        ]);

        return $response->json('rows.0');
    }

    /**
     * Поиск Компаний (Юрлиц) через Контактные лица по телефону
     * (Работает только с телефоном, так как связь через контакты обычно идет по мобильному)
     */
    public function findCompaniesByContact(string $phone): array
    {
        // Если передали email, поиск компаний через контактное лицо не сработает корректно в 99% случаев
        if (str_contains($phone, '@')) {
            return [];
        }

        $searchPhone = PhoneHelper::forSearch($phone);
        $foundCompanies = [];

        // 1. Ищем в контактных лицах
        $contacts = $this->makeRequest()->get('entity/contactperson', [
            'filter' => "phone~{$searchPhone}",
            'expand' => 'agent', // Подгружаем родительскую компанию
        ])->json('rows', []);

        foreach ($contacts as $contact) {
            $agent = $contact['agent'] ?? null;

            // Проверяем, что агент загрузился и это Юрлицо (legal) или ИП (entrepreneur)
            if ($agent && in_array($agent['companyType'] ?? '', ['legal', 'entrepreneur'])) {
                $foundCompanies[$agent['id']] = $this->mapCompanyData($agent);
            }
        }

        // 2. Ищем в самих компаниях (прямой телефон в карточке)
        $companies = $this->makeRequest()->get('entity/counterparty', [
            // Ищем и ООО и ИП
            'filter' => "phone~{$searchPhone};companyType=legal", // Можно добавить OR companyType=entrepreneur через API фильтры сложнее, проще сделать 2 запроса если критично
        ])->json('rows', []);

        foreach ($companies as $company) {
            $foundCompanies[$company['id']] = $this->mapCompanyData($company);
        }

        return array_values($foundCompanies);
    }

    /**
     * Создание контрагента (Физлицо или Юрлицо)
     * @throws RequestException
     * @throws ConnectionException
     */
    public function create(array $data): array
    {
        // Добавляем тег, чтобы знать, что создан через сайт
        $data['tags'] = array_merge($data['tags'] ?? [], ['site_registered']);

        // Формируем тело запроса
        $body = [
            'name' => $data['name'],
            'companyType' => $data['companyType'] ?? 'individual',
            'tags' => $data['tags'],
        ];

        // Заполняем контакты (телефон или email)
        if (!empty($data['phone'])) {
            $body['phone'] = PhoneHelper::normalize($data['phone']);
        }
        if (!empty($data['email'])) {
            $body['email'] = $data['email'];
        }

        // Адрес
        if (!empty($data['actual_address'])) {
            $body['actualAddress'] = $data['actual_address'];
        }

        // Реквизиты для Юрлиц
        if (($data['companyType'] ?? '') !== 'individual') {
            if (!empty($data['inn'])) $body['inn'] = $data['inn'];
            if (!empty($data['kpp'])) $body['kpp'] = $data['kpp'];
            if (!empty($data['address_legal'])) $body['legalAddress'] = $data['address_legal'];
        }

        return $this->makeRequest()
            ->post('entity/counterparty', $body)
            ->throw()
            ->json();
    }

    /**
     * Форматирование данных компании для сохранения в БД
     */
    private function mapCompanyData(array $raw): array
    {
        return [
            'ms_id' => $raw['id'],
            'title' => $raw['name'],
            'inn' => $raw['inn'] ?? null,
            'kpp' => $raw['kpp'] ?? null,
            'type' => $raw['companyType'] ?? 'legal',
            'address_legal' => $raw['legalAddress'] ?? null,
            'address_fact' => $raw['actualAddress'] ?? null,
        ];
    }
}
