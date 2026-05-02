from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Availability(Base):
    __tablename__ = "availabilities"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_hour = Column(Integer, nullable=False)
    end_hour = Column(Integer, nullable=False)
    priority = Column(Integer, default=3)
    
    employee = relationship("Employee", back_populates="availabilities")