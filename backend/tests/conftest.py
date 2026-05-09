import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../.env")
load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_TEST_DB")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5432/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Creates and drops test db"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, base_url="http://testserver/api/v1") as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(client):
    """Creates a user in the database and returns their login credentials."""
    user_data = {
        "email": "worker@example.com", 
        "name": "Worker", 
        "password": "securepassword"
    }
    
    client.post("/auth/register", json=user_data) 
    
    return user_data

@pytest.fixture
def authorized_client(client, test_user):
    """Returns a TestClient that is already authenticated."""
    client.post(
        "/auth/login", 
        data={"username": test_user["email"], "password": test_user["password"]}
    )
    
    return client