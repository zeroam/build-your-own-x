.PHONY: init run stop shell db test

init:
	docker-compose exec users python manage.py recreate_db
	docker-compose exec users python manage.py seed_db

run:
	docker-compose up -d

stop:
	docker-compose down

shell:
	docker-compose exec users flask shell

db:
	docker-compose exec users-db psql -U postgres

test:
	docker-compose exec users python -m pytest "project/tests" -s -p no:warnings --cov="project"

test-lf:
	docker-compose exec users python -m pytest "project/tests" -s -p no:warnings --lf

check:
	docker-compose exec users flake8 project
	docker-compose exec users black project
	docker-compose exec users /bin/sh -c "isort project/**/*.py"