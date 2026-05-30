from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import date
from typing import Optional

class TimeRangeBase(BaseModel):
    date: date
    start_time: int = Field(ge=0, le=1440, description="Start time in minutes from midnight (0-1440)")
    end_time: int = Field(ge=0, le=1440, description="End time in minutes from midnight (0-1440)")

    @model_validator(mode="after")
    def validate_hours(self) -> 'TimeRangeBase':
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be strictly before end_time")
        return self

class AvailabilityCreate(TimeRangeBase):
    pass

class AvailabilityResponse(TimeRangeBase):
    id: int
    employee_id: int

    model_config = ConfigDict(from_attributes=True)

class UnavailabilityCreate(TimeRangeBase):
    priority: int = Field(ge=1, le=5, description="1 (low) to 5 (high)", default=3)
    cause: str

class UnavailabilityResponse(TimeRangeBase):
    id: int
    employee_id: int
    priority: int
    cause: str

    model_config = ConfigDict(from_attributes=True)