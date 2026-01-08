<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('password')
                    ->password()
                    ->required(),
                TextInput::make('first_name')
                    ->required(),
                TextInput::make('last_name'),
                TextInput::make('ms_id'),
                TextInput::make('ms_price_type'),
                TextInput::make('loyalty_balance')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                Select::make('main_role')
                    ->options(['b2c' => 'B2c', 'b2b' => 'B2b'])
                    ->default('b2c')
                    ->required(),
            ]);
    }
}
