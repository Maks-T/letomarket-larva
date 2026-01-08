# Конфигурация
DOCKER_DIR = docker
COMPOSE_FILE = $(DOCKER_DIR)/docker-compose.yml
COMPOSE = docker compose -f $(COMPOSE_FILE)

# Генерация дерева файлов
tree:
	@echo "Генерация дерева файлов..."
	tree -I 'vendor|node_modules|.git' > tree.txt
	@echo "Дерево сохранено в tree.txt"

# Вход в контейнер приложения
bash:
	$(COMPOSE) exec app bash

# Миграция
migrate:
	$(COMPOSE) exec app php artisan migrate

chown:
    sudo chown -R $USER:$USER .

# Показать справку
help:
	@echo "Доступные команды:"
	@echo "  make tree  - Создать tree.txt"
	@echo "  make bash  - Войти в контейнер app"
	@echo "  make help  - Показать эту справку"