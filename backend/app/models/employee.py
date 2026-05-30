from sqlalchemy import Column, Integer, String, Boolean, Double, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.enums import RoleEnum

class Employee(Base):
    __tablename__ = "employees"

    id = Column(
        Integer, primary_key=True, index=True
    )
    email = Column(
        String, unique=True, index=True, nullable=False
    )
    name = Column(
        String, nullable=False
    )
    hashed_password = Column(
        String, nullable=False
    )
    full_time_fraction = Column(
        Double, nullable=False, default=1.0
    )
    role = Column(
        Enum(RoleEnum, name="role_enum", create_type=True), 
        default=RoleEnum.STAFF, 
        nullable=False
    )
    is_admin = Column(
        Boolean, default=False
    )
    is_active = Column(
        Boolean, default=True
    )

    availabilities = relationship("Availability", back_populates="employee", cascade="all, delete-orphan")
    unavailabilities = relationship("Unavailability", back_populates="employee", cascade="all, delete-orphan")
    scheduled_shifts = relationship("ScheduleShift", back_populates="employee")