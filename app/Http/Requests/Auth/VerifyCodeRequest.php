<?php

namespace App\Http\Requests\Auth;

use App\Support\ContactHelper;
use Illuminate\Foundation\Http\FormRequest;

class VerifyCodeRequest extends FormRequest
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
            'login' => ['required', 'string'],
            'code'  => ['required', 'string', 'size:6'], // Строго 6 символов
        ];
    }

    /**
     * Кастомные сообщения для вывода на фронтенде
     */
    public function messages(): array
    {
        return [
            'login.required' => 'Произошла ошибка: не указан логин.',
            'code.required'  => 'Пожалуйста, введите код подтверждения.',
            'code.size'      => 'Код должен состоять из 6 цифр.',
        ];
    }
}
