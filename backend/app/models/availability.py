from sqlalchemy import Column, Integer, ForeignKey, Date, String
from sqlalchemy.orm import relationship
from app.database import Base


class Availability(Base):
    __tablename__ = "availabilities"

    id = Column(
        Integer, primary_key=True, index=True
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
    
    employee = relationship("Employee", back_populates="availabilities")


class Unavailability(Base):
    __tablename__ = "unavailabilities"

    id = Column(
        Integer, primary_key=True, index=True
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
    priority = Column(
        Integer, nullable=False, default=3
    )
    cause = Column(
        String, nullable=False
    )
    
    employee = relationship("Employee", back_populates="unavailabilities")