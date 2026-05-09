# =====================
# Register
# =====================

def test_register_user(client):
    """Verify if user registration works."""
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "name": "Test User", "password": "67676767"}
    )
    assert response.status_code == 200, "Incorrect status code"
    assert response.json()["email"] == "test@example.com"

# =====================
# Login
# =====================

def test_login_success(client):
    """Verify if a registered user can login and receive a token."""
    email = "login_test@example.com"
    password = "676767"
    client.post(
        "/auth/register",
        json={"email": email, "name": "Login Tester", "password": password}
    )

    response = client.post(
        "/auth/login",
        data={"username": email, "password": password}
    )

    assert response.status_code == 200, "Incorrect status code"
    assert response.json() == {"message": "logged in successfully"}
    assert "token" in response.cookies, "Token cookie was not set"
    assert response.cookies["token"] is not None, "Token cookie is empty"


def test_login_wrong_password(client):
    """Verify if incorrect passwords return a 401 Unauthorized"""
    email = "wrong_pass@example.com"
    client.post(
        "/auth/register",
        json={"email": email, "name": "Wrong Pass", "password": "676767"}
    )
    
    response = client.post(
        "/auth/login",
        data={"username": email, "password": "767676"}
    )
    
    assert response.status_code == 401, "Incorrect status code"
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_non_existent_user(client):
    """Verify if logging in with an unregistered email returns a 401"""
    response = client.post(
        "/auth/login",
        data={"username": "ghost@example.com", "password": "676767"}
    )
    
    assert response.status_code == 401, "Incorrect status code"