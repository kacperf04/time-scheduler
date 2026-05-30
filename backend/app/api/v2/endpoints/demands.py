from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database import get_db
from app.models.demand import Demand, DemandSlot
from app.schemas.demand import DemandCreate, DemandResponse, DemandUpdate
from app.models.employee import Employee
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=DemandResponse, status_code=status.HTTP_201_CREATED)
def create_demand(
    demand_in: DemandCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create demands (not admin)"
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create demands (not active)"
        )
    
    new_demand = Demand(
        start_date=demand_in.start_date,
        end_date=demand_in.end_date,
        is_posted=demand_in.is_posted
    )

    for slot_in in demand_in.slots:
        new_slot = DemandSlot(
            date=slot_in.date,
            start_time=slot_in.start_time,
            end_time=slot_in.end_time,
            required_role=slot_in.required_role,
            required_employees=slot_in.required_employees
        )
        new_demand.slots.append(new_slot)

    db.add(new_demand)
    db.commit()
    db.refresh(new_demand)

    return new_demand


@router.get("/", response_model=List[DemandResponse])
def get_all_demands(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to fetch all demands (not active)"
        )
    
    demands = db.query(Demand).order_by(Demand.start_date.desc()).offset(skip).limit(limit).all()
    return demands


@router.get("/{demand_id}", response_model=DemandResponse)
def get_demand_by_id(
    demand_id: int, 
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to fetch demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")
    
    return demand


@router.delete("/{demand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_demand(
    demand_id: int, 
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete demands (not admin)"
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")
    
    db.delete(demand)
    db.commit()
    return None


@router.put("/{demand_id}", response_model=DemandResponse)
def update_demand(
    demand_id: int,
    demand_in: DemandUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit demands (not admin)"
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")

    if demand.is_posted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot edit a demand that has already been posted"
        )

    if demand_in.start_date is not None:
        demand.start_date = demand_in.start_date
    if demand_in.end_date is not None:
        demand.end_date = demand_in.end_date
    if demand_in.is_posted is not None:
        demand.is_posted = demand_in.is_posted

    if demand_in.slots is not None:
        demand.slots.clear() 
        
        for slot_in in demand_in.slots:
            new_slot = DemandSlot(
                date=slot_in.date,
                start_time=slot_in.start_time,
                end_time=slot_in.end_time,
                required_role=slot_in.required_role,
                required_employees=slot_in.required_employees
            )
            demand.slots.append(new_slot)

    db.commit()
    db.refresh(demand)
    
    return demand


@router.get("/date/{start_date}", response_model=DemandResponse)
def get_demand_by_date(
    start_date: date, 
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to fetch demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.start_date == start_date).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")
    
    return demand


@router.delete("/date/{start_date}", status_code=status.HTTP_204_NO_CONTENT)
def delete_demand_by_date(
    start_date: date, 
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete demands (not admin)"
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.start_date == start_date).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")
    
    db.delete(demand)
    db.commit()
    return None


@router.put("/date/{start_date}", response_model=DemandResponse)
def update_demand_by_date(
    start_date: date,
    demand_in: DemandUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit demands (not admin)"
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit demands (not active)"
        )

    demand = db.query(Demand).filter(Demand.start_date == start_date).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demand not found")

    if demand.is_posted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot edit a demand that has already been posted"
        )

    if demand_in.start_date is not None:
        demand.start_date = demand_in.start_date
    if demand_in.end_date is not None:
        demand.end_date = demand_in.end_date
    if demand_in.is_posted is not None:
        demand.is_posted = demand_in.is_posted

    if demand_in.slots is not None:
        demand.slots.clear() 
        
        for slot_in in demand_in.slots:
            new_slot = DemandSlot(
                date=slot_in.date,
                start_time=slot_in.start_time,
                end_time=slot_in.end_time,
                required_role=slot_in.required_role,
                required_employees=slot_in.required_employees
            )
            demand.slots.append(new_slot)

    db.commit()
    db.refresh(demand)
    
    return demand