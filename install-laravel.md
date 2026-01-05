# 1. Вход в контейнер
docker compose exec app bash

# 2. Переход в рабочую директорию
cd /var/www/html

# 3. Установка Laravel во временную папку
composer create-project laravel/laravel temp_app --prefer-dist

# 4. Копирование файлов в корень
cp -r temp_app/. .

# 5. Очистка временной папки
rm -rf temp_app

# 6. Настройка окружения
cp .env.example .env
php artisan key:generate

# 7. Выход из контейнера
exit