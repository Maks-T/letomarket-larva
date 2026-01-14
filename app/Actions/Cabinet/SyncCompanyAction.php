<?php

namespace App\Actions\Cabinet;

use App\Models\Customer;
use App\Models\CustomerCompany;
use App\Services\Integration\MS\MsCounterpartyService;

class SyncCompanyAction
{
    public function __construct(protected MsCounterpartyService $msService) {}

    public function execute(Customer $customer, array $data): CustomerCompany
    {
        // 1. Ищем в МС по ИНН (это уникальный ключ для бизнеса)
        $msCompany = $this->msService->findCompanyByInn($data['inn']);

        if (!$msCompany) {
            // 2. Если нет — создаем новую компанию в МС
            $msCompany = $this->msService->createOrUpdate([
                'name' => $data['title'],
                'companyType' => $data['type'], // 'legal' или 'entrepreneur'
                'inn' => $data['inn'],
                'kpp' => $data['kpp'] ?? null,
            ]);
        }

        // 3. Сохраняем связь локально
        return CustomerCompany::updateOrCreate(
            ['customer_id' => $customer->id, 'inn' => $data['inn']],
            [
                'ms_id' => $msCompany['id'],
                'title' => $msCompany['name'],
                'type' => $data['type'],
                'kpp' => $data['kpp'] ?? null,
                'actual_address' => $msCompany['actualAddress'] ?? null,
            ]
        );
    }
}
