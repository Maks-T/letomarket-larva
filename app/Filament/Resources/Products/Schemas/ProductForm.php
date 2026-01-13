<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section; // Из Forms
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Основная информация')
                    ->schema([
                        TextInput::make('name')
                            ->label('Название товара')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->unique(ignoreRecord: true),

                        Select::make('category_id')
                            ->label('Категория')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        TextInput::make('article')
                            ->label('Артикул'),

                        TextInput::make('code')
                            ->label('Код МС'),

                        Toggle::make('is_active')
                            ->label('Активен на сайте')
                            ->default(true)
                            ->inline(false),

                        Textarea::make('description')
                            ->label('Описание')
                            ->rows(5)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Варианты и Цены')
                    ->description('Список SKU, загруженных из МоегоСклада')
                    ->schema([
                        Toggle::make('has_variants')
                            ->label('Товар с вариациями')
                            ->disabled()
                            ->dehydrated(false),

                        TextInput::make('min_price')
                            ->label('Базовая розничная цена')
                            ->prefix('₽')
                            ->numeric()
                            ->disabled()
                            ->hidden(fn ($get) => $get('has_variants')),

                        Repeater::make('variants')
                            ->relationship()
                            ->label('Список SKU')
                            ->schema([
                                TextInput::make('name')->label('Название варианта'),
                                TextInput::make('sku')->label('Артикул'),
                                TextInput::make('price')->label('Цена')->prefix('₽'),
                                TextInput::make('stock')->label('Остаток'),
                            ])
                            ->addable(false)
                            ->deletable(false)
                            ->reorderable(false)
                            ->columnSpanFull(),
                    ]),

                Section::make('Синхронизация')
                    ->collapsed()
                    ->schema([
                        TextInput::make('ms_id')
                            ->label('UUID МойСклад')
                            ->disabled(),
                        TextInput::make('created_at')
                            ->label('Создан')
                            ->disabled(),
                        TextInput::make('updated_at')
                            ->label('Обновлен')
                            ->disabled(),
                    ])->columns(3),
            ]);
    }
}
