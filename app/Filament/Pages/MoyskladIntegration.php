<?php

namespace App\Filament\Pages;

use App\Jobs\ImportCategoriesJob;
use App\Jobs\ImportProductsJob;
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Section;
use Filament\Notifications\Notification;

class MoyskladIntegration extends Page
{
    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-cloud-arrow-down';
    protected static ?string $navigationLabel = 'Интеграция с МС';

    protected static ?string $title = 'Управление интеграцией МойСклад';
    protected static string|null|\UnitEnum $navigationGroup = 'Сервисы';

    public int $productsCount = 0;
    public int $categoriesCount = 0;

    public function mount(): void
    {
        $this->refreshStats();
    }

    public function refreshStats(): void
    {
        $this->productsCount = \App\Models\Product::count();
        $this->categoriesCount = \App\Models\Category::count();
    }

    public function importCategories(): void
    {
        ImportCategoriesJob::dispatch();
        Notification::make()->title('Импорт категорий запущен')->success()->send();
    }

    public function importProducts(): void
    {
        ImportProductsJob::dispatch(); // Запуск
        Notification::make()->title('Импорт товаров запущен в фоне')->success()->send();
    }

    // ← Вот это главное в v4
    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Статистика')
                    ->schema([
                        TextEntry::make('productsCount')
                            ->label('Товаров всего')
                            ->formatStateUsing(fn (int $state): string => number_format($state, 0, '', ' ')),

                        TextEntry::make('categoriesCount')
                            ->label('Категорий всего')
                            ->formatStateUsing(fn (int $state): string => number_format($state, 0, '', ' ')),
                    ])
                    ->columns(2),

                // Кнопки (actions) — можно оставить как есть
                \Filament\Schemas\Components\Actions::make([
                  Action::make('importCategories')
                        ->label('Импорт категорий')
                        ->action('importCategories'),

                    Action::make('importProducts')
                        ->label('Импорт продуктов')
                        ->color('warning')
                        ->action('importProducts'),
                ]),
            ]);
    }
}
