from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.availability import Availability
from app.schemas.availability import AvailabilityCreate, AvailabilityResponse
from app.api.deps import get_current_user
from app.models.employee import Employee

router = APIRouter()

@router.post("/", response_model=AvailabilityResponse)
def create_availability(
        availability_in: AvailabilityCreate,
        db: Session = Depends(get_db),
        current_user: Employee = Depends(get_current_user)
):
    overlap_exists = db.query(Availability).filter(
        Availability.employee_id == current_user.id,
        Availability.date == availability_in.date,
        Availability.start_hour < availability_in.end_hour,
        Availability.end_hour > availability_in.start_hour
    ).first()

    if overlap_exists:
        raise HTTPException(
            status_code=400,
            detail=f"Overlap detected with existing slot: {overlap_exists.start_hour}:00-{overlap_exists.end_hour}:00"
        )

    new_availability = Availability(
        employee_id=current_user.id,
        date=availability_in.date,
        start_hour=availability_in.start_hour,
        end_hour=availability_in.end_hour,
        priority=availability_in.priority
    )
    db.add(new_availability)
    db.commit()
    db.refresh(new_availability)

    return new_availability

@router.get("/me", response_model=List[AvailabilityResponse])
def get_employee_availabilities(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    return db.query(Availability).filter(Availability.employee_id == current_user.id).all()