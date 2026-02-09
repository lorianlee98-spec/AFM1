import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_password_hash():
    password = "testpass123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpass", hashed) is False


def test_access_token():
    user_id = "123"
    token = create_access_token(user_id)
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["type"] == "access"
