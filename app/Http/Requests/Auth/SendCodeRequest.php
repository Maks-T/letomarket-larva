<?php

namespace App\Http\Requests\Auth;

use App\Support\ContactHelper;
use Illuminate\Foundation\Http\FormRequest;

class SendCodeRequest extends FormRequest
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
            'login' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Кастомные сообщения для вывода на фронтенде
     */
    public function messages(): array
    {
        return [
            'login.required' => 'Пожалуйста, введите номер телефона или Email.',
            'login.string' => 'Неверный формат данных.',
            'login.max' => 'Значение слишком длинное (максимум 255 символов).',
        ];
    }
}
