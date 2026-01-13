<?php

namespace App\Filament\Resources\Products\Tables;


use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // ... ваши колонки ...
                ImageColumn::make('images.path')
                    ->label('Фото')
                    ->disk('public')
                    ->limit(1)
                    ->square(),

                TextColumn::make('name')
                    ->label('Название')
                    ->searchable()
                    ->wrap()
                    ->weight('medium'),

                TextColumn::make('article')
                    ->label('Артикул')
                    ->searchable()
                    ->copyable()
                    ->color('gray'),

                TextColumn::make('category.name')
                    ->label('Категория')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('min_price')
                    ->label('Цена')
                    ->money('rub')
                    ->sortable()
                    ->state(function ($record) {
                        return $record->has_variants
                            ? 'от ' . number_format($record->min_price, 0, '.', ' ')
                            : number_format($record->min_price, 0, '.', ' ');
                    }),

                IconColumn::make('has_variants')
                    ->label('SKU')
                    ->boolean()
                    ->trueIcon('heroicon-o-swatch')
                    ->falseIcon('heroicon-o-cube')
                    ->toggleable(),

                IconColumn::make('is_active')
                    ->label('Активен')
                    ->boolean(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->label('Категория')
                    ->searchable()
                    ->preload(),

                TernaryFilter::make('has_variants')
                    ->label('Тип товара')
                    ->trueLabel('С вариациями')
                    ->falseLabel('Простые'),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
