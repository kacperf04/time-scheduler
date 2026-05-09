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


@router.post("/bulk", response_model=list[AvailabilityResponse])
def create_bulk_availability(
    availabilities_in: list[AvailabilityCreate],
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    slots = sorted(availabilities_in, key=lambda x: (x.date, x.start_hour))

    merged: list[AvailabilityCreate] = []
    i = 0
    while i < len(slots):
        current = slots[i]
        while (
            i + 1 < len(slots)
            and slots[i + 1].date == current.date
            and slots[i + 1].start_hour == current.end_hour
        ):
            i += 1
            current = AvailabilityCreate(
                date=current.date,
                start_hour=current.start_hour,
                end_hour=slots[i].end_hour,
                priority=current.priority
            )
        merged.append(current)
        i += 1

    dates = list({s.date for s in merged})
    existing = db.query(Availability).filter(
        Availability.employee_id == current_user.id,
        Availability.date.in_(dates)
    ).all()

    for slot in merged:
        overlap = next(
            (ex for ex in existing
             if ex.date == slot.date
             and ex.start_hour < slot.end_hour
             and ex.end_hour > slot.start_hour),
            None
        )
        if overlap:
            raise HTTPException(
                status_code=400,
                detail=f"Overlap detected with existing slot: {overlap.start_hour}:00-{overlap.end_hour}:00"
            )

    new_availabilities = [
        Availability(
            employee_id=current_user.id,
            date=s.date,
            start_hour=s.start_hour,
            end_hour=s.end_hour,
            priority=s.priority
        )
        for s in merged
    ]

    db.add_all(new_availabilities)
    db.commit()
    for a in new_availabilities:
        db.refresh(a)

    return new_availabilities


@router.get("/me", response_model=List[AvailabilityResponse])
def get_employee_availabilities(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    return db.query(Availability).filter(Availability.employee_id == current_user.id).all()