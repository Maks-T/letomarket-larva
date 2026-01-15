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
     * Возвращает последние 10 цифр для поиска
     */
    public static function forSearch(string $phone): string
    {
        $normalized = self::normalize($phone);
        // Если номер короче 10 цифр, возвращаем как есть, чтобы не упало
        if (strlen($normalized) < 10) {
            return $normalized;
        }

        return substr($normalized, -10);
    }
}
