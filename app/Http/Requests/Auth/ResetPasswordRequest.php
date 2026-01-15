<?php

namespace App\Http\Requests\Auth;

use App\Support\ContactHelper;
use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
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
            'code'     => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'login.required'     => 'Не указан логин.',
            'code.required'      => 'Введите код подтверждения.',
            'code.size'          => 'Код должен состоять из 6 цифр.',
            'password.required'  => 'Введите новый пароль.',
            'password.min'       => 'Пароль должен быть не менее 6 символов.',
            'password.confirmed' => 'Пароли не совпадают.',
        ];
    }
}
