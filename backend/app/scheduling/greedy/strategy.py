from ..base import SchedulingStrategy
from typing import Any
from sqlalchemy.orm import Session

class GreedyStrategy(SchedulingStrategy):
    """
    Implementation of greedy algorithm.

    The greedy algorithm works by making the best choice at every step
    withour revisiting earlier ones. 
    It accepts any immediatiately available time slot based on what seems most favorable 
    at that point.
    """

    def generate_schedule(self, db: Session, start_date: str) -> list[dict[str, Any]]:
        pass