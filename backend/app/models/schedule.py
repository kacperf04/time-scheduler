from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.enums import ScheduleStatus, SchedulingAlgorithm
from datetime import datetime

class Schedule(Base):
    __tablename__ = "schedules"

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
    status = Column(
        Enum(ScheduleStatus, name="schedule_status_enum", create_type=True), 
        default=ScheduleStatus.PENDING, 
        nullable=False
    )
    created_timestamp = Column(
        TIMESTAMP, nullable=False, default=datetime.now
    )
    posted_timestamp = Column(
        TIMESTAMP, default=None
    ) 
    algorithm_used = Column(
        Enum(SchedulingAlgorithm, name="scheduling_algorithm_enum", create_type=True), 
        default=None
    )

    shifts = relationship("ScheduleShift", back_populates="schedule", cascade="all, delete-orphan")


class ScheduleShift(Base):
    __tablename__ = "scheduled_shifts"

    id = Column(
        Integer, primary_key=True, index=True
    )
    schedule_id = Column(
        Integer, ForeignKey("schedules.id"), nullable=False
    )
    employee_id = Column(
        Integer, ForeignKey("employees.id"), nullable=False
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

    schedule = relationship("Schedule", back_populates="shifts")
    employee = relationship("Employee", back_populates="scheduled_shifts")