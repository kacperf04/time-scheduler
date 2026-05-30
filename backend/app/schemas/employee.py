from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import RoleEnum

class EmployeeCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: RoleEnum = RoleEnum.STAFF

class EmployeeResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_admin: bool
    is_active: bool
    full_time_fraction: float
    role: RoleEnum

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str