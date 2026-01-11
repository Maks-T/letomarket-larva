<?php

namespace App\Actions\Auth;

use App\Models\Customer;
use App\Services\Integration\MS\MsCounterpartyService;
use App\Support\PhoneHelper;
use Illuminate\Support\Facades\Log;

class LoginOrRegisterAction
{
    public function __construct(
        protected MsCounterpartyService $msService
    ) {}

    /**
     * Находит или создает клиента на основе Логина (Тел/Email) и данных из МС
     */
    public function execute(string $login): Customer
    {
        $type = PhoneHelper::detectType($login); //ToDo

        // 1. Ищем в локальной БД
        // Если телефон - ищем по phone_normalized, если email - по email
        $column = $type === 'phone' ? 'phone_normalized' : 'email';
        $customer = Customer::where($column, $login)->first();

        if ($customer) {
            return $customer;
        }

        // 2. Если локально нет -> Ищем в МоемСкладе
        // (Сервис сам разберется, искать по email или телефону)
        $msData = $this->msService->findIndividual($login);

        if ($msData) {
            // Сценарий: Клиент есть в МС, но на сайте впервые
            Log::info("Auth: Found existing MS counterparty for {$login}: {$msData['id']}");

            $customer = Customer::create([
                $column => $login,
                'phone' => $type === 'phone' ? ($msData['phone'] ?? $login) : null,
                'email' => $type === 'email' ? $login : null, // Заполняем email, если вход по email
                'first_name' => $this->parseFirstName($msData['name']),
                'last_name' => $this->parseLastName($msData['name']),
                'ms_id' => $msData['id'],
                'actual_address' => $msData['actualAddress'] ?? null,
                // Сразу проставляем баланс, если он пришел
                'loyalty_balance' => $msData['bonusPoints'] ?? 0,
            ]);

        } else {
            // Сценарий: Абсолютно новый клиент
            Log::info("Auth: Creating new customer for {$login}");

            // 1. Создаем в МС
            $newMsData = $this->msService->create([
                'name' => 'Новый Клиент', // Потом попросим заполнить в профиле ToDo
                'phone' => $type === 'phone' ? $login : null,
                'email' => $type === 'email' ? $login : null,
                'companyType' => 'individual'
            ]);

            // 2. Создаем у нас
            $customer = Customer::create([
                $column => $login,
                'phone' => $type === 'phone' ? $login : null,
                'email' => $type === 'email' ? $login : null,
                'first_name' => 'Новый Клиент',
                'ms_id' => $newMsData['id'],
            ]);
        }

        return $customer;
    }

    // Хелперы для разбивки ФИО (В МС имя одной строкой)
    private function parseFirstName(string $fullName): string //ToDo
    {
        $parts = explode(' ', trim($fullName));
        // Если "Иванов Иван", берем Иван. Если просто "Иван", берем Иван.
        return count($parts) > 1 ? $parts[1] : $parts[0];
    }

    private function parseLastName(string $fullName): ?string //ToDo
    {
        $parts = explode(' ', trim($fullName));
        return count($parts) > 1 ? $parts[0] : null;
    }
}
