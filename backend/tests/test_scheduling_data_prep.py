import pytest
from app.models.availability import Availability
from app.models.employee import Employee
from app.scheduling.common.data_prep import get_availability_data
from datetime import date

def test_get_availability_data_returns_7_day_window(db_session):
    mock_availabilities = [
        Availability(employee_id=1, date="2026-06-09", start_hour=8, end_hour=12, priority=5), 
        Availability(employee_id=1, date="2026-06-15", start_hour=10, end_hour=14, priority=5),
        Availability(employee_id=1, date="2026-06-20", start_hour=8, end_hour=17, priority=5),
        Availability(employee_id=1, date="2026-06-01", start_hour=8, end_hour=12, priority=5),
    ]

    db_session.add_all(mock_availabilities)
    db_session.commit()

    start_date = "2026-06-09"
    results = get_availability_data(db_session, start_date=start_date)

    assert len(results) == 2, "Should only return availabilities within the 7 days"

    returned_dates = [avail.date for avail in results]
    assert date(2026, 6, 9) in returned_dates
    assert date(2026, 6, 15) in returned_dates
    assert date(2026, 6, 20) not in returned_dates
    assert date(2026, 6, 1) not in returned_dates
