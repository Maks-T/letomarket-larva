<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Section; // Используем компонент из Forms
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Основная информация')
                    ->schema([
                        Select::make('parent_id')
                            ->label('Родительская категория')
                            ->relationship('parent', 'name')
                            ->searchable()
                            ->preload(),

                        TextInput::make('name')
                            ->label('Название')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->label('URL (Slug)')
                            ->required()
                            ->unique(ignoreRecord: true),

                        Toggle::make('is_active')
                            ->label('Показывать на сайте')
                            ->default(true),

                        TextInput::make('sort_order')
                            ->label('Сортировка')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),

                Section::make('Медиа и SEO')
                    ->collapsed()
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Изображение категории')
                            ->image()
                            ->directory('categories'),

                        Textarea::make('description')
                            ->label('Описание')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Интеграция (МойСклад)')
                    ->collapsed()
                    ->schema([
                        TextInput::make('external_code')
                            ->label('Внешний код')
                            ->disabled(),
                        TextInput::make('ms_id')
                            ->label('UUID')
                            ->disabled(),
                    ])->columns(2),
            ]);
    }
}
