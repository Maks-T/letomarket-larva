<?php

namespace App\Support;

class PhoneHelper
{
    /**
     * Приводит к формату 79991234567 для сохранения в БД
     */
    public static function normalize(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (empty($phone)) {
            return '';
        }

        if (strlen($phone) === 11 && ($phone[0] === '8' || $phone[0] === '7')) {
            $phone[0] = '7';
        } elseif (strlen($phone) === 10) {
            $phone = '7' . $phone;
        }

        return $phone;
    }

    /**
     * Возвращает последние 10 цифр для "мягкого" поиска в МоемСкладе
     * Пример: из 79001234567 вернет 9001234567
     */
    public static function forSearch(string $phone): string
    {
        $normalized = self::normalize($phone);
        return substr($normalized, -10);
    }
}
