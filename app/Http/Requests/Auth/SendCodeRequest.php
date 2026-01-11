<?php

namespace App\Http\Requests\Auth;

use App\Support\PhoneHelper;
use Illuminate\Foundation\Http\FormRequest;

class SendCodeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Если это телефон, нормализуем его перед проверкой
        if ($this->login && !str_contains($this->login, '@')) {
            $this->merge(['login' => PhoneHelper::normalize($this->login)]);
        }
    }

    public function rules(): array
    {
        return [
            // Login может быть email или телефоном
            'login' => ['required', 'string', 'max:255'],
        ];
    }
}
