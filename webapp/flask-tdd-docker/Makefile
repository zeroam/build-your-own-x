.PHONY: run stop shell db test

run:
	docker-compose up -d

stop:
	docker-compose down

shell:
	docker-compose exec users flask shell

db:
	docker-compose exec users-db psql -U postgres

test:
	docker-compose exec users python -m pytest "project/tests" -s -p no:warnings

test-lf:
	docker-compose exec users python -m pytest "project/tests" -s -p no:warnings --lf