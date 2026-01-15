<?php

namespace App\Actions\Auth;

use App\Models\Customer;
use App\Services\Integration\MS\MsCounterpartyService;
use App\Support\ContactHelper;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

class LoginOrRegisterAction
{
    public function __construct(
        protected MsCounterpartyService $msService
    ) {}

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function execute(string $login): Customer
    {
        // Нормализация и определение типа контакта
        $normalized = ContactHelper::normalize($login);
        $type = ContactHelper::detectType($login);

        $column = $type === ContactHelper::TYPE_PHONE ? 'phone_normalized' : 'email';

        // Поиск локально
        $customer = Customer::where($column, $normalized)->first();
        if ($customer) {
            return $customer;
        }

        // Поиск в МоемСкладе (чтобы не дублировать клиентов)
        $msData = $this->msService->findIndividual($login);

        if ($msData) {
            // Если нашли в МС — сохраняем локально
            return Customer::create([
                'phone' => $type === ContactHelper::TYPE_PHONE ? $normalized : ($msData['phone'] ?? null),
                'phone_normalized' => $type === ContactHelper::TYPE_PHONE
                    ? $normalized
                    : (isset($msData['phone']) ? ContactHelper::normalize($msData['phone']) : null),

                'email' => $type === ContactHelper::TYPE_EMAIL ? $normalized : ($msData['email'] ?? null),

                'first_name' => $msData['name'] ?? 'Клиент МС',
                'ms_id' => $msData['id'],
                'loyalty_balance' => $msData['bonusPoints'] ?? 0,
            ]);
        }

        // Если нет нигде — создаем нового в МС и локально
        $newMs = $this->msService->createOrUpdate([
            'name' => 'Клиент ' . $login,
            'phone' => $type === ContactHelper::TYPE_PHONE ? $normalized : null,
            'email' => $type === ContactHelper::TYPE_EMAIL ? $normalized : null,
        ]);

        return Customer::create([
            'phone' => $type === ContactHelper::TYPE_PHONE ? $normalized : null,
            'phone_normalized' => $type === ContactHelper::TYPE_PHONE ? $normalized : null,
            'email' => $type === ContactHelper::TYPE_EMAIL ? $normalized : null,
            'first_name' => 'Новый клиент',
            'ms_id' => $newMs['id'],
        ]);
    }
}
