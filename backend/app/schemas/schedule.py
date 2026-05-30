from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import date, datetime
from typing import Optional, List
from app.models.enums import ScheduleStatus, SchedulingAlgorithm


class ScheduleShiftBase(BaseModel):
    employee_id: int
    date: date
    start_time: int = Field(ge=0, le=1440, description="Minutes from midnight")
    end_time: int = Field(ge=0, le=1440, description="Minutes from midnight")

    @model_validator(mode="after")
    def validate_time(self) -> 'ScheduleShiftBase':
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be strictly before end_time")
        return self


class ScheduleShiftCreate(ScheduleShiftBase):
    pass


class ScheduleShiftResponse(ScheduleShiftBase):
    id: int
    schedule_id: int

    model_config = ConfigDict(from_attributes=True)


class ScheduleBase(BaseModel):
    start_date: date
    end_date: date
    is_posted: bool = False
    status: ScheduleStatus = ScheduleStatus.PENDING
    algorithm_used: Optional[SchedulingAlgorithm] = None

    @model_validator(mode="after")
    def validate_dates(self) -> 'ScheduleBase':
        if self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")
        return self
    

class ScheduleCreate(ScheduleBase):
    pass


class ScheduleResponse(ScheduleBase):
    id: int
    created_timestamp: datetime
    posted_timestamp: Optional[datetime] = None
    
    shifts: List[ScheduleShiftResponse] = []

    model_config = ConfigDict(from_attributes=True)