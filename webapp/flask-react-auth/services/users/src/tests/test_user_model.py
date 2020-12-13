import json

from src import bcrypt
from src.api.users.crud import get_user_by_id


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("justatest", "test@test.com", "greaterthaneight")
    user_two = add_user("justatest2", "test@test.com", "greaterthaneight")
    assert user_one.password != user_two.password


def test_update_user_with_password(test_app, test_database, add_user):
    password_one = "greaterthaneight"
    password_two = "somethingdifferent"

    user = add_user("user-to-be-updated", "update-me@testdriven.io", password_one)
    assert bcrypt.check_password_hash(user.password, password_one)

    client = test_app.test_client()
    resp = client.put(
        f"/users/{user.id}",
        data=json.dumps(
            {"username": "me", "email": "foo@testdriven.io", "password": password_two}
        ),
        content_type="application/json",
    )
    assert resp.status_code == 200

    user = get_user_by_id(user.id)
    assert bcrypt.check_password_hash(user.password, password_one)
    assert not bcrypt.check_password_hash(user.password, password_two)
