from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import date, datetime
from typing import Optional, List
from app.models.enums import RoleEnum

class DemandSlotBase(BaseModel):
    date: date
    start_time: int = Field(ge=0, le=1440, description="Minutes from midnight")
    end_time: int = Field(ge=0, le=1440, description="Minutes from midnight")
    required_role: RoleEnum = RoleEnum.STAFF
    required_employees: int = Field(ge=1, default=1)

    @model_validator(mode="after")
    def validate_time(self) -> 'DemandSlotBase':
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be strictly before end_time")
        return self
    

class DemandSlotCreate(DemandSlotBase):
    pass


class DemandSlotResponse(DemandSlotBase):
    id: int
    demand_id: int

    model_config = ConfigDict(from_attributes=True)


class DemandBase(BaseModel):
    start_date: date
    end_date: date
    is_posted: bool

    @model_validator(mode="after")
    def validate_dates(self) -> 'DemandBase':
        if self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")
        return self
    

class DemandCreate(DemandBase):
    slots: List[DemandSlotCreate] = []


class DemandUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_posted: Optional[bool] = None
    slots: Optional[List[DemandSlotCreate]] = None

    @model_validator(mode="after")
    def validate_dates(self) -> 'DemandUpdate':
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")
        return self


class DemandResponse(DemandBase):
    id: int
    created_timestamp: datetime
    posted_timestamp: Optional[datetime] = None
    
    slots: List[DemandSlotResponse] = []

    model_config = ConfigDict(from_attributes=True)