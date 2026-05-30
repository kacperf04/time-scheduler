from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.availability import Availability

def get_availability_data(db: Session, start_date: str) -> list[Availability]:
    """
    Fetches availability data and returns its as a list.
    
    Parameters
    ----------
    db: Session
        The active SQLAlchemy database session to fetch availabilities
    start_date: str
        The starting date for the schedule

    Returns
    -------
    list[Availability]
        A list with all availabilities for the given time period.
    """
    availability_data = db.query(Availability).filter(
        Availability.date >= start_date,
        Availability.date <= str(datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=7))
    ).all()

    return availability_data