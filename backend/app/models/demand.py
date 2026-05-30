from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.enums import RoleEnum
from datetime import datetime

class Demand(Base):
    __tablename__ = "demands"

    id = Column(
        Integer, primary_key=True, index=True
    )
    start_date = Column(
        Date, nullable=False
    )
    end_date = Column(
        Date, nullable=False
    )
    is_posted = Column(
        Boolean, nullable=False, default=False
    )
    created_timestamp = Column(
        TIMESTAMP, nullable=False, default=datetime.now
    )
    posted_timestamp = Column(
        TIMESTAMP, default=None
    )

    slots = relationship("DemandSlot", back_populates="demand", cascade="all, delete-orphan")


class DemandSlot(Base):
    __tablename__ = "demand_slots"

    id = Column(
        Integer, primary_key=True, index=True
    )
    demand_id = Column(
        Integer, ForeignKey("demands.id"), nullable=False
    )
    date = Column(
        Date, nullable=False
    )
    start_time = Column(
        Integer, nullable=False
    )
    end_time = Column(
        Integer, nullable=False
    )
    required_role = Column(
        Enum(RoleEnum, name="role_enum", create_type=True), 
        default=RoleEnum.STAFF, 
        nullable=False
    )
    required_employees = Column(
        Integer, nullable=False, default=1
    )

    demand = relationship("Demand", back_populates="slots")