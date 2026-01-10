<?php

namespace App\Support;

class PhoneHelper
{
    public static function normalize(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (empty($phone)) {
            return '';
        }

        if (strlen($phone) === 11 && $phone[0] === '8') {
            $phone[0] = '7';
        }

        if (strlen($phone) === 10) {
            return '7' . $phone;
        }

        return $phone;
    }
}
