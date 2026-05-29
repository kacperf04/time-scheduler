from typing import Any
from sqlalchemy.orm import Session
from app.scheduling.base import SchedulingStrategy
from app.scheduling.common.data_prep import get_availability_data
from app.models.availability import Availability

class GreedyStrategy(SchedulingStrategy):
    """
    Implementation of greedy algorithm.

    The greedy algorithm works by making the best choice at every step
    withour revisiting earlier ones. 
    It accepts any immediatiately available time slot based on what seems most favorable 
    at that point.
    """

    def _priority_heuristic(self, availavility: Availability) -> tuple:
        """Helper nethod to score slots: Priority first, chronological second."""
        return (-availavility.priority, availavility.date, availavility.start_hour)

    def generate_schedule(self, db: Session, start_date: str) -> list[dict[str, Any]]:
        schedule: list[dict[str, Any]]
        availabilities = get_availability_data(db, start_date)

        sorted_availabilities = sorted(availabilities, key=self._priority_heuristic)
        
