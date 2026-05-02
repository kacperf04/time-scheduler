from pydantic import BaseModel, ConfigDict, Field
from datetime import date

class AvailabilityBase(BaseModel):
    date: date
    start_hour: int = Field(ge=0, le=23, description="Start hour (0-23)")
    end_hour: int = Field(ge=0, le=23, description="End hour (0-23)")
    priority: int = Field(ge=0, le=5, description="1 (low) to 5 (high))")

class AvailabilityCreate(BaseModel):
    pass

class AvailabilityResponse(BaseModel):
    id: int
    employee_id: int

    model_config = ConfigDict(from_attributes=True)