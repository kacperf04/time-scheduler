from abc import ABC, abstractmethod
from typing import Any
from sqlalchemy.orm import Session

class SchedulingStrategy(ABC):
    """
    Abstract base class defining a scheduling algorithm.
    """

    @abstractmethod
    def generate_schedule(self, db: Session, start_date: str) -> list[dict[str, Any]]:
        """
        Executes the scheduling logic to assign employee shifts.

        Parameters
        ----------
        db: Session
            The active SQLAlchemy database session to fetch availabilities
        start_date: str
            The starting date for the schedule

        Returns
        -------
        List[Dict[str, Any]]
            A list of dictionaries representing the finalized schedule.
            Excpected output format per dictionary:
            {
                "employee_id": int,
                "date": str,
                "start_hour": int,
                "end_hour": int
            }
        """
        pass