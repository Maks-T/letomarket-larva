<?php


namespace App\Actions\Auth;

use App\Models\Customer;
use App\Services\Integration\MS\MsCounterpartyService;
use App\Support\PhoneHelper;

class LoginOrRegisterAction
{
    public function __construct(protected MsCounterpartyService $msService) {}

    public function execute(string $login): Customer
    {
        $type = PhoneHelper::detectType($login);
        $normalized = $type === 'phone' ? PhoneHelper::normalize($login) : strtolower(trim($login));
        $column = $type === 'phone' ? 'phone_normalized' : 'email';

        // 1. Проверка локально
        $customer = Customer::where($column, $normalized)->first();
        if ($customer) return $customer;

        // 2. Поиск в МС среди физлиц (чтобы подтянуть историю и бонусы)
        $msData = $this->msService->findIndividual($login);

        if ($msData) {
            return Customer::create([
                'phone' => $type === 'phone' ? $login : ($msData['phone'] ?? null),
                'phone_normalized' => $type === 'phone' ? $normalized : (isset($msData['phone']) ? PhoneHelper::normalize($msData['phone']) : null),
                'email' => $type === 'email' ? $normalized : ($msData['email'] ?? null),
                'first_name' => $msData['name'] ?? 'Клиент МС',
                'ms_id' => $msData['id'],
                'loyalty_balance' => $msData['bonusPoints'] ?? 0,
            ]);
        }

        // 3. Создание нового в МС и локально
        $newMs = $this->msService->createOrUpdate([
            'name' => 'Клиент ' . $login,
            'phone' => $type === 'phone' ? $login : null,
            'email' => $type === 'email' ? $login : null,
        ]);

        return Customer::create([
            'phone' => $type === 'phone' ? $login : null,
            'phone_normalized' => $type === 'phone' ? $normalized : null,
            'email' => $type === 'email' ? $normalized : null,
            'first_name' => 'Новый клиент',
            'ms_id' => $newMs['id'],
        ]);
    }
}
