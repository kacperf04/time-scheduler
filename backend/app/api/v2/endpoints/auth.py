from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=EmployeeResponse)
def register(user_in: EmployeeCreate, db: Session = Depends(get_db)):
    if db.query(Employee).filter(Employee.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_employee = Employee(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    return new_employee

@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = db.query(Employee).filter(Employee.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        path="/",
        samesite="lax",
        secure=False
    )
    
    return {"message": "logged in successfully"}


@router.get("/me")
def current_user(
    current_user: Employee = Depends(get_current_user)
):
    return current_user