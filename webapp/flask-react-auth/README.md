[![pipeline status](https://gitlab.com/zeroam/flask-react-auth/badges/master/pipeline.svg)](https://gitlab.com/zeroam/flask-react-auth/commits/master)
## README
Authentication with Flask, React, and Docker

## Commands
- db initialize
```bash
docker-compose exec api python manage.py recreate_db
docker-compose exec api python manage.py seed_db
```
- linting and formatting
```bash
docker-compose exec api flake8 src
docker-compose exec api black src
docker-compose exec api isort src
```
- test code with coverage report
```bash
docker-compose exec api pytest src/tests -p no:warnings --cov=src --cov-report term-missing
```
### Link
- [Authentication with Flask, React, and Docker](https://testdriven.io/courses/auth-flask-react/)
- [Source Code](https://gitlab.com/testdriven/flask-react-auth)
