from pydantic import BaseModel, EmailStr, ConfigDict

class EmployeeCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class EmployeeResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str