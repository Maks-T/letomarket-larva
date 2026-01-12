FROM php:8.4-fpm

# Аргументы для создания пользователя (совпадают с WSL)
ARG user=laravel
ARG uid=1000

# 1. Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Установка PHP расширений
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# 3. Установка Redis
RUN pecl install redis && docker-php-ext-enable redis

# 4. Установка Node.js 22 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# 5. Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Копирование настроек PHP
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

# 7. Создание системного пользователя (чтобы не работать от root)
# Мы создаем пользователя с ID 1000, который совпадает с вашим пользователем в Ubuntu/WSL
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# 8. Настройка Git (чтобы не ругался на safe directory)
# Выполняем глобально для всех, но важно для нашего юзера
RUN git config --system --add safe.directory /var/www/html

# 9. Установка рабочей директории
WORKDIR /var/www/html

# 10. Переключение на пользователя
USER $user