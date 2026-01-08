<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\Schemas\UserForm;
use App\Filament\Resources\Users\Tables\UsersTable;
use App\Models\User;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserResource extends Resource
{
  protected static ?string $model = User::class;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

  // Поле поиска 'name' или 'email'
  protected static ?string $recordTitleAttribute = 'name';

  // Название в меню (слева)
  protected static ?string $navigationLabel = 'Сотрудники';

  // Название одной записи
  protected static ?string $modelLabel = 'Сотрудник';

  // Название во множественном числе (Заголовок страницы)
  protected static ?string $pluralModelLabel = 'Сотрудники';
  protected static string|null|\UnitEnum $navigationGroup = 'Пользователи';

  public static function form(Schema $schema): Schema
  {
    return UserForm::configure($schema);
  }

  public static function table(Table $table): Table
  {
    return UsersTable::configure($table);
  }

  public static function getRelations(): array
  {
    return [
      //
    ];
  }

  public static function getPages(): array
  {
    return [
      'index' => ListUsers::route('/'),
      'create' => CreateUser::route('/create'),
      'edit' => EditUser::route('/{record}/edit'),
    ];
  }
}
