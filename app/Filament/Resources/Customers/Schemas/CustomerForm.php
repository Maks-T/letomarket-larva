<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('phone_normalized')
                    ->tel()
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('password')
                    ->password(),
                TextInput::make('first_name'),
                TextInput::make('last_name'),
                DatePicker::make('birth_date'),
                TextInput::make('gender'),
                Textarea::make('actual_address')
                    ->columnSpanFull(),
                TextInput::make('ms_id'),
                TextInput::make('ms_price_type_uuid'),
                TextInput::make('ms_bonus_program_id'),
                TextInput::make('loyalty_balance')
                    ->required()
                    ->numeric()
                    ->default(0.0),
            ]);
    }
}
