from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.database import get_db
from app.models.employee import Employee
from dotenv import load_dotenv
from app.core.security import ALGORITHM 
import os

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(request: Request, db: Session = Depends(get_db)) -> Employee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    token = request.cookies.get("token")

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(Employee).filter(Employee.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    
    return user
