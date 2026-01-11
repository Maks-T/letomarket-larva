<?php

namespace App\Http\Requests\Auth;

use App\Support\PhoneHelper;
use Illuminate\Foundation\Http\FormRequest;

class LoginPasswordRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->login && !str_contains($this->login, '@')) {
            $this->merge(['login' => PhoneHelper::normalize($this->login)]);
        }
    }

    public function rules(): array
    {
        return [
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }
}
