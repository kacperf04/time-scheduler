import pytest

# =====================
# Post
# =====================

@pytest.mark.parametrize(
        "test_name, payload, expected_status",
        [
            (
                "Success: Valid hours", 
                {"date": "2026-05-09", "start_hour": 8, "end_hour": 12, "priority": 5}, 
                200
            ),
            (
                "Success: Valid hours", 
                {"date": "2026-05-09", "start_hour": 14, "end_hour": 19, "priority": 5}, 
                200
            ),
            (
                "Failure: Overlapping hours", 
                {"date": "2026-05-09", "start_hour": 10, "end_hour": 16, "priority": 5}, 
                400
            ),
            (
                "Failure: Invalid hours", 
                {"date": "2026-05-10", "start_hour": 12, "end_hour": 12, "priority": 5}, 
                422
            ),
            (
                "Failure: Invalid hours", 
                {"date": "2026-05-10", "start_hour": 16, "end_hour": 14, "priority": 5}, 
                422
            ),
        ]
)
def test_single_availability_add(authorized_client, test_name, payload, expected_status):
    response = authorized_client.post(
        "/availabilities",
        json=payload
    )

    assert response.status_code == expected_status, f"Failed: {test_name}"

@pytest.mark.parametrize(
    "test_name, payload, expected_status",
    [
        (
            "Success: Valid, adjacent hours",
            [
                {"date": "2026-05-12", "start_hour": 8, "end_hour": 9, "priority": 5},
                {"date": "2026-05-12", "start_hour": 9, "end_hour": 10, "priority": 5}, 
                {"date": "2026-05-12", "start_hour": 10, "end_hour": 11, "priority": 5}, 
                {"date": "2026-05-12", "start_hour": 11, "end_hour": 12, "priority": 5}, 
                {"date": "2026-05-12", "start_hour": 12, "end_hour": 13, "priority": 5}, 
            ],
            200
        ),
        (
            "Success: Valid, scattered hours",
            [
                {"date": "2026-05-13", "start_hour": 8, "end_hour": 9, "priority": 5},
                {"date": "2026-05-13", "start_hour": 9, "end_hour": 10, "priority": 5}, 
                {"date": "2026-05-13", "start_hour": 14, "end_hour": 18, "priority": 5}, 
            ],
            200
        )
    ]
)
def test_bulk_availability_add(authorized_client, test_name, payload, expected_status):
    response = authorized_client.post(
        "/availabilities/bulk",
        json=payload
    )

    assert response.status_code == expected_status, f"Failed: {test_name}"