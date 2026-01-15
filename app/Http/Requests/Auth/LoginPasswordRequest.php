<?php

namespace App\Http\Requests\Auth;

use App\Support\ContactHelper;
use Illuminate\Foundation\Http\FormRequest;

class LoginPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('login')) {
            $this->merge([
                'login' => ContactHelper::normalize($this->input('login'))
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'login.required'    => 'Введите телефон или email.',
            'password.required' => 'Введите пароль.',
        ];
    }
}
