#!/bin/bash

# НАСТРОЙКИ
# Папка, где лежит проект
PROJECT_DIR="/var/www/letomarket"

# Репозиторий
REPO="git@github.com:Maks-T/letomarket-larva.git"

# Ветка
BRANCH="main"

# Сколько хранить старых релизов (для отката)
KEEP_RELEASES=3

# Версия PHP для перезагрузки FPM
PHP_FPM="php8.4-fpm"

# СТАРТ
set -e # Остановить скрипт при любой ошибке

echo "🚀 Начало деплоя..."

# Генерируем имя папки релиза (дата-время)
RELEASE_NAME=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$PROJECT_DIR/releases/$RELEASE_NAME"

echo "📂 Создание папки релиза: $RELEASE_NAME"
mkdir -p "$RELEASE_DIR"

# 1. Клонируем код
echo "⬇️ Клонирование репозитория..."
git clone -b $BRANCH $REPO "$RELEASE_DIR" --depth 1

# 2. Настраиваем симлинки на общие файлы
echo "🔗 Подключение .env и storage..."
# Удаляем .env, который пришел из git
rm -rf "$RELEASE_DIR/.env"
# Ставим ссылку на боевой .env
ln -s "$PROJECT_DIR/shared/.env" "$RELEASE_DIR/.env"

# Удаляем пустую папку storage из git
rm -rf "$RELEASE_DIR/storage"
# Ставим ссылку на общую папку storage (где картинки и логи)
ln -s "$PROJECT_DIR/storage" "$RELEASE_DIR/storage"

# Гарантируем, что папки существуют и доступны
mkdir -p "$PROJECT_DIR/storage/framework/"{sessions,views,cache}
mkdir -p "$PROJECT_DIR/storage/logs"
chmod -R 775 "$PROJECT_DIR/storage"

# 3. Установка зависимостей (Backend)
echo "📦 Установка PHP зависимостей..."
cd "$RELEASE_DIR"
composer install --no-dev --optimize-autoloader --no-interaction --quiet

# 4. Сборка фронтенда (Frontend)
echo "🎨 Сборка фронтенда (NPM)..."
npm ci --quiet
npm run build
# Удаляем node_modules
rm -rf node_modules

# 5. Команды Laravel
echo "🔥 Настройка Laravel..."

# Исправляем права
chmod -R 775 bootstrap/cache

# Создаем ссылку на storage в public (для картинок)
php artisan storage:link

# Миграции (изменяют структуру БД)
php artisan migrate --force

# Очистка и кэширование
php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Обновление ассетов админки Filament
php artisan filament:upgrade

# 6. ПЕРЕКЛЮЧЕНИЕ (Атомарный деплой)
echo "🔄 Переключение на новую версию..."
ln -sfn "$RELEASE_DIR" "$PROJECT_DIR/current"

# 7. Перезагрузка PHP-FPM (Сброс OPcache)
echo "⚡ Перезагрузка PHP-FPM..."
# Используем sudo, так как для рестарта сервиса нужны права
sudo service $PHP_FPM reload

# 8. Очистка старых релизов
echo "🧹 Очистка старых версий..."
cd "$PROJECT_DIR/releases"
ls -dt * | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo "✅ ДЕПЛОЙ УСПЕШНО ЗАВЕРШЕН!"
echo "🌐 Сайт доступен по адресу: https://leto-test.webtm.ru"