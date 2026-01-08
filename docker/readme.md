# Перед запуском

# В корне проекта (затем удалить перед установкой laravel)
mkdir public
touch public/index.php

## Создать символическую ссылку
cd /docker
ln -s ../.env .env

## Собрать контейнеры
cd /docker
docker compose up -d --build

