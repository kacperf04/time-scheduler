from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import date

class AvailabilityBase(BaseModel):
    date: date
    start_hour: int = Field(ge=8, le=23, description="Start hour (8-23)")
    end_hour: int = Field(ge=8, le=23, description="End hour (8-23)")
    priority: int = Field(ge=0, le=5, description="1 (low) to 5 (high))")

    @model_validator(mode="after")
    def validate_hours(self) -> 'AvailabilityBase':
        if self.start_hour >= self.end_hour:
            raise ValueError("start hour must be strictly before the end hour")
        return self

class AvailabilityCreate(AvailabilityBase):
    pass

class AvailabilityResponse(AvailabilityBase):
    id: int
    employee_id: int

    model_config = ConfigDict(from_attributes=True)