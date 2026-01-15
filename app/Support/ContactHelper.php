<?php

namespace App\Support;

class ContactHelper
{
    public const string TYPE_EMAIL = 'email';
    public const string TYPE_PHONE = 'phone';

    /**
     * Определяет тип контакта: email или телефон
     */
    public static function detectType(string $input): string
    {
        if (str_contains($input, '@')) {
            return self::TYPE_EMAIL;
        }

        return self::TYPE_PHONE;
    }

    /**
     * Умная нормализация:
     * Если это телефон -> чистит через PhoneHelper
     * Если это email -> приводит к нижнему регистру и тримит
     */
    public static function normalize(string $input): string
    {
        if (self::detectType($input) === self::TYPE_EMAIL) {
            return strtolower(trim($input));
        }

        return PhoneHelper::normalize($input);
    }
}
