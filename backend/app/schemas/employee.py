from pydantic import BaseModel, EmailStr

class EmployeeCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class EmployeeResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_admin: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str