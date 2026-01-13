<?php

namespace App\Filament\Resources\Categories;

use App\Filament\Resources\Categories\Pages;
use App\Filament\Resources\Categories\Schemas\CategoryForm;
use App\Filament\Resources\Categories\Schemas\CategoryInfolist;
use App\Filament\Resources\Categories\Tables\CategoriesTable;
use App\Models\Category;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    // В V4 иконки передаются через Enum или строку
    protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedFolder;

    protected static ?string $navigationLabel = 'Категории';
    protected static ?string $modelLabel = 'Категория';
    protected static ?string $pluralModelLabel = 'Категории';
    protected static string|null|\UnitEnum $navigationGroup = 'Каталог';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return CategoryForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return CategoryInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CategoriesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'view' => Pages\ViewCategory::route('/{record}'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
