<x-filament-panels::page>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        {{-- Карточка 1: Статистика --}}
        <div class="fi-section rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <h3 class="text-base font-semibold leading-6 text-gray-950 dark:text-white mb-4">
                Статус каталога
            </h3>

            <div class="space-y-4">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <span class="text-gray-600 dark:text-gray-300">Категорий в базе:</span>
                    <span class="text-xl font-bold text-primary-600">{{ $categoriesCount }}</span>
                </div>

                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <span class="text-gray-600 dark:text-gray-300">Товаров в базе:</span>
                    <span class="text-xl font-bold text-primary-600">{{ $productsCount }}</span>
                </div>

                <div class="text-right">
                    {{-- Обычная кнопка Filament --}}
                    <x-filament::button color="gray" size="sm" wire:click="refreshStats">
                        Обновить цифры
                    </x-filament::button>
                </div>
            </div>
        </div>

        {{-- Карточка 2: Действия --}}
        <div class="fi-section rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <h3 class="text-base font-semibold leading-6 text-gray-950 dark:text-white mb-2">
                Ручной запуск
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Запуск фоновых процессов обмена данными.
            </p>

            <div class="flex flex-col gap-4">
                {{-- Строка 1 --}}
                <div class="flex items-center justify-between gap-4 border-b pb-4 border-gray-100 dark:border-gray-800">
                    <div>
                        <div class="font-medium text-gray-950 dark:text-white">1. Категории</div>
                        <div class="text-xs text-gray-500">Загрузка дерева групп</div>
                    </div>
                    <x-filament::button wire:click="importCategories">
                        Запустить
                    </x-filament::button>
                </div>

                {{-- Строка 2 --}}
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <div class="font-medium text-gray-950 dark:text-white">2. Товары</div>
                        <div class="text-xs text-gray-500">Загрузка номенклатуры</div>
                    </div>
                    <x-filament::button color="gray" wire:click="importProducts">
                        Запустить
                    </x-filament::button>
                </div>
            </div>
        </div>

    </div>

</x-filament-panels::page>
