<?php

return [

  /*
  |--------------------------------------------------------------------------
  | Authentication Defaults
  |--------------------------------------------------------------------------
  */

  'defaults' => [
    'guard' => 'web', // По умолчанию для Front-end (Customers)
    'passwords' => 'customers',
  ],

  /*
  |--------------------------------------------------------------------------
  | Authentication Guards
  |--------------------------------------------------------------------------
  */

  'guards' => [
    // 1. Гвард для Сотрудников (Админка Filament)
    'admin' => [
      'driver' => 'session',
      'provider' => 'users',
    ],

    // 2. Гвард для Клиентов (Сайт / Inertia)
    'web' => [
      'driver' => 'session',
      'provider' => 'customers',
    ],

    // 3. API
    'sanctum' => [
      'driver' => 'sanctum',
      'provider' => null, // Sanctum сам поймет, кто это (User или Customer)
    ],
  ],

  /*
  |--------------------------------------------------------------------------
  | User Providers
  |--------------------------------------------------------------------------
  */

  'providers' => [
    'users' => [
      'driver' => 'eloquent',
      'model' => App\Models\User::class,
    ],

    'customers' => [
      'driver' => 'eloquent',
      'model' => App\Models\Customer::class,
    ],
  ],

  /*
  |--------------------------------------------------------------------------
  | Resetting Passwords
  |--------------------------------------------------------------------------
  */

  'passwords' => [
    'users' => [
      'provider' => 'users',
      'table' => 'password_reset_tokens',
      'expire' => 60,
      'throttle' => 60,
    ],

    'customers' => [
      'provider' => 'customers',
      'table' => 'password_reset_tokens',
      'expire' => 60,
      'throttle' => 60,
    ],
  ],

  'password_timeout' => 10800,

];