<?php

namespace App\Services\Integration\MS;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductPrice;
use App\Models\ProductVariant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MsImportService
{
    public function __construct(
        protected MsReferenceService $refService,
        protected MsClient $client
    ) {}

    /**
     * 1. Импорт категорий (Доработанный)
     */
    public function importCategories(): void
    {
        Log::info('[MS Import] Start Categories...');

        // Получаем все группы
        $folders = iterator_to_array($this->client->getAll('entity/productfolder'));

        // Проход 1: Создание/Обновление
        foreach ($folders as $row) {
            Category::updateOrCreate(
                ['ms_id' => $row['id']],
                [
                    'name' => $row['name'],
                    'slug' => Str::slug($row['name']) . '-' . substr($row['id'], 0, 4),
                    'external_code' => $row['externalCode'],
                    'description' => $row['description'] ?? null,
                    'is_active' => !($row['archived'] ?? false),
                ]
            );
        }

        // Проход 2: Привязка родителей
        foreach ($folders as $row) {
            if (isset($row['productFolder']['meta']['href'])) {
                $parentUuid = $this->extractUuid($row['productFolder']['meta']['href']);
                $parentId = Category::where('ms_id', $parentUuid)->value('id');

                if ($parentId) {
                    Category::where('ms_id', $row['id'])->update(['parent_id' => $parentId]);
                }
            }
        }

        Log::info('[MS Import] Categories done.');
    }

    /**
     * 2. Импорт Товаров и Вариаций
     */
    public function importProducts(): void
    {
        Log::info('[MS Import] Start Products...');

        // Шаг А: Импортируем простые товары и "родителей"
        // Фильтруем, чтобы не тянуть услуги или комплекты, если не нужно
        foreach ($this->client->getAll('entity/product') as $row) {
            $this->processProduct($row);
        }

        // Шаг Б: Импортируем модификации (Variant)
        Log::info('[MS Import] Start Variants...');
        foreach ($this->client->getAll('entity/variant') as $row) {
            $this->processVariant($row);
        }

        // Шаг В: Пересчет минимальных цен для товаров
        $this->recalcMinPrices();

        Log::info('[MS Import] Products & Variants done.');
    }

    /**
     * Обработка одного товара (Product)
     */
    protected function processProduct(array $row): void
    {
        // 1. Определяем категорию
        $categoryId = null;
        if (isset($row['productFolder']['meta']['href'])) {
            $catUuid = $this->extractUuid($row['productFolder']['meta']['href']);
            $categoryId = Category::where('ms_id', $catUuid)->value('id');
        }

        // 2. Создаем/Обновляем товар
        $product = Product::updateOrCreate(
            ['ms_id' => $row['id']],
            [
                'name' => $row['name'],
                'slug' => Str::slug($row['name']) . '-' . substr($row['id'], 0, 4),
                'article' => $row['article'] ?? null,
                'code' => $row['code'] ?? null,
                'description' => $row['description'] ?? null,
                'category_id' => $categoryId,
                'is_active' => !($row['archived'] ?? false),
                // Если variantsCount > 0, значит это товар-родитель, у него будут SKU в entity/variant
                'has_variants' => ($row['variantsCount'] ?? 0) > 0,
            ]
        );

        // 3. Если товар ПРОСТОЙ (нет вариаций), создаем ему "Главный вариант"
        // В МС у простого товара цены и остатки лежат прямо в entity/product
        if (!$product->has_variants) {
            $this->createMainVariant($product, $row);
        }

        // 4. Обработка картинок товара
        $this->syncImages($product, $row['images'] ?? []);
    }

    /**
     * Создание скрытого главного варианта для простого товара
     */
    protected function createMainVariant(Product $product, array $row): void
    {
        $variant = ProductVariant::updateOrCreate(
            [
                'product_id' => $product->id,
                'is_main' => true,
            ],
            [
                'ms_id' => $row['id'], // У простого товара ID варианта = ID товара
                'name' => $row['name'],
                'sku' => $row['article'] ?? null,
                'barcode' => $row['barcodes'][0]['ean13'] ?? null,
                'stock' => $this->getStockFromRow($row), // Парсим остаток (если он есть в API product)
                'price' => $this->getBuyPrice($row), // Базовая цена продажи
            ]
        );

        // Цены (Sale Prices)
        $this->syncPrices($variant, $row['salePrices'] ?? []);
    }

    /**
     * Обработка модификации (Variant)
     */
    protected function processVariant(array $row): void
    {
        // 1. Ищем родительский товар
        if (!isset($row['product']['meta']['href'])) return;

        $parentUuid = $this->extractUuid($row['product']['meta']['href']);
        $product = Product::where('ms_id', $parentUuid)->first();

        if (!$product) return; // Родитель еще не загружен

        // 2. Создаем вариант
        $variant = ProductVariant::updateOrCreate(
            ['ms_id' => $row['id']],
            [
                'product_id' => $product->id,
                'is_main' => false,
                'name' => $row['name'],
                'sku' => $row['code'] ?? null, // В МС артикул часто в code у модификаций
                'barcode' => $row['barcodes'][0]['ean13'] ?? null,
                'stock' => $this->getStockFromRow($row),
                'price' => $this->getBuyPrice($row),
            ]
        );

        // 3. Цены
        $this->syncPrices($variant, $row['salePrices'] ?? []);

        // 4. Характеристики (Цвет, Размер)
        $this->syncCharacteristics($product, $variant, $row['characteristics'] ?? []);

        // 5. Картинки варианта
        $this->syncImages($variant, $row['images'] ?? []);
    }

    /**
     * Синхронизация цен
     */
    protected function syncPrices(ProductVariant $variant, array $salePrices): void
    {
        foreach ($salePrices as $priceRow) {
            $typeUuid = $this->extractUuid($priceRow['priceType']['meta']['href']);
            $value = $priceRow['value'] / 100.0; // В МС цены в копейках

            ProductPrice::updateOrCreate(
                [
                    'product_variant_id' => $variant->id,
                    'price_type_uuid' => $typeUuid,
                ],
                [
                    'price' => $value,
                ]
            );

            // Если это цена "Цена продажи" (дефолтная), обновляем в самом варианте для быстрого доступа
            // Обычно "Цена продажи" идет первой или имеет специфический внешний код.
            // Для упрощения берем первую попавшуюся как базовую, если она > 0
            if ($variant->price == 0 && $value > 0) {
                $variant->update(['price' => $value]);
            }
        }
    }

    /**
     * Синхронизация Характеристик (Attributes)
     */
    protected function syncCharacteristics(Product $product, ProductVariant $variant, array $characteristics): void
    {
        $charIds = [];

        foreach ($characteristics as $char) {
            // $char['id'] - UUID характеристики
            // $char['name'] - Название (Цвет)
            // $char['value'] - Значение (Красный)

            // 1. Ищем или создаем Атрибут
            $attribute = Attribute::firstOrCreate(
                ['ms_id' => $char['id']],
                ['name' => $char['name'], 'type' => 'string', 'is_filterable' => true]
            );

            // 2. Ищем или создаем Значение атрибута
            $attValue = AttributeValue::firstOrCreate(
                [
                    'attribute_id' => $attribute->id,
                    'value' => $char['value']
                ],
                ['ms_id' => null] // У значений характеристик нет UUID в простом виде
            );

            // 3. Привязываем к Товару (для фильтрации)
            // pivot table: product_attribute_values
            $product->attributeValues()->syncWithoutDetaching([$attValue->id]);

            // 4. Сохраняем в варианте JSON (для вывода в карточке)
            $charIds[$attribute->name] = $attValue->value;
        }

        if (!empty($charIds)) {
            $variant->update(['characteristics' => $charIds]);
        }
    }

    /**
     * Скачивание и сохранение картинок
     */
    protected function syncImages($model, array $imagesMeta): void
    {
        // $model может быть Product или ProductVariant
        $msImageIds = []; // Собираем ID, чтобы удалить старые

        $sort = 0;
        foreach ($imagesMeta['rows'] ?? [] as $imgData) {
            $uuid = $imgData['id']; // ID картинки в МС
            $msImageIds[] = $uuid;

            // Проверяем, есть ли уже такая картинка
            $existing = ProductImage::where('ms_id', $uuid)->first();

            if (!$existing) {
                $downloadUrl = $imgData['meta']['downloadHref'];

                // Скачиваем
                $content = $this->client->download($downloadUrl);

                if ($content) {
                    $filename = 'products/' . $uuid . '.jpg'; // МС обычно отдает jpg/png
                    Storage::disk('public')->put($filename, $content);

                    $model->images()->create([
                        'ms_id' => $uuid,
                        'path' => $filename,
                        'sort_order' => $sort++,
                        'is_main' => ($sort === 1) // Первая - главная
                    ]);
                }
            } else {
                // Если есть, просто обновляем сортировку, если нужно
                // Или перепривязываем к модели, если вдруг потерялась
            }
        }

        // Удаление картинок, которых больше нет в МС
        // $model->images()->whereNotIn('ms_id', $msImageIds)->delete();
    }

    /**
     * Извлечение UUID из href
     */
    private function extractUuid(string $href): string
    {
        // https://.../entity/product/UUID
        $parts = explode('/', $href);
        return end($parts);
    }

    private function getBuyPrice(array $row): float
    {
        return ($row['buyPrice']['value'] ?? 0) / 100.0;
    }

    private function getStockFromRow(array $row): int
    {
        // В стандартном entity/product остатки не приходят, если не запросить ?expand=...
        // Либо нужно использовать report/stock/all.
        // Для MVP, если остатков нет в ответе, ставим 0 или 999.
        // Чтобы получить остатки, нужно делать отдельный запрос к report/stock/all
        // Сейчас поставим заглушку, но правильный путь - это отдельный сервис остатков.
        return 0;
    }

    private function recalcMinPrices(): void
    {
        // Обновляем min_price у товаров на основе их вариантов
        // Это можно сделать одним SQL запросом для скорости
        \DB::statement("
            UPDATE products p
            JOIN (
                SELECT product_id, MIN(price) as min_p
                FROM product_variants
                WHERE price > 0
                GROUP BY product_id
            ) v ON p.id = v.product_id
            SET p.min_price = v.min_p
        ");
    }
}
