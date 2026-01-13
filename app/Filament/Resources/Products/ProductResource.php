<?php

namespace App\Filament\Resources\Products;

use App\Filament\Resources\Products\Pages;
use App\Filament\Resources\Products\Schemas\ProductForm;
use App\Filament\Resources\Products\Schemas\ProductInfolist;
use App\Filament\Resources\Products\Tables\ProductsTable;
use App\Models\Product;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedCube;
    protected static ?string $navigationLabel = 'Товары';
    protected static ?string $modelLabel = 'Товар';
    protected static ?string $pluralModelLabel = 'Товары';
    protected static string|null|\UnitEnum $navigationGroup = 'Каталог';
    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'name';

    // Глобальный поиск
    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'article', 'code', 'slug'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Артикул' => $record->article,
            'Категория' => $record->category?->name,
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with('category');
    }

    public static function form(Schema $schema): Schema
    {
        return ProductForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ProductInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProductsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'view' => Pages\ViewProduct::route('/{record}'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
