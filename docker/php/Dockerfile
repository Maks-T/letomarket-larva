FROM unit:1.32.1-php8.3

# Устанавливаем зависимости, Git и Node.js 22
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip curl libzip-dev default-mysql-client git \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Устанавливаем Redis
RUN pecl install redis && docker-php-ext-enable redis

# Устанавливаем Node.js 22 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Копируем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Копируем конфиг Unit (путь относительно корня проекта)
COPY docker/unit-config.json /docker-entrypoint.d/config.json

# Копируем настройки PHP (local.ini)
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

WORKDIR /var/www/html