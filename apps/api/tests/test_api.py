import pytest
from httpx import AsyncClient
from fastapi import HTTPException
from apps.api.src.main import app, check_if_user_opted_out, get_all_events, get_free_time_for_date
from unittest.mock import patch, AsyncMock, MagicMock
from datetime import datetime
import sys
import os
from googleapiclient.errors import HttpError


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api', 'src')))

CALENDAR_ID = "bella.frizerski.salon@gmail.com"

@pytest.fixture
def anyio_backend():
    return 'asyncio'


service_durations = {"Women's Haircut": 45, "Men's Haircut": 30}

### Tests for getting free time
@pytest.mark.anyio
async def test_get_free_time_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-free-time", params={"date": "2024-10-18", "services": "Women's Haircut"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.anyio
async def test_get_free_time_no_services():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-free-time", params={"date": "2024-10-18", "services": ""})
    assert response.status_code == 400
    assert response.json() == {"detail": "No service selected"}

@pytest.mark.anyio
async def test_get_free_time_invalid_service():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-free-time", params={"date": "2024-10-18", "services": "InvalidService"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid service: InvalidService"}

# tests for confirming bookings
@pytest.mark.anyio
@patch("apps.api.src.main.get_all_events")
@patch("apps.api.src.main.calendar_service.events")
async def test_confirm_booking_success(mock_events, mock_get_all_events):
    mock_get_all_events.return_value = [{"id": "sample_event_id"}]

    mock_event = {
        'id': 'sample_event_id',
        'extendedProperties': {'private': {'isConfirmed': 'false'}}
    }
    mock_events().get.return_value.execute.return_value = mock_event
    
    mock_events().update.return_value.execute = AsyncMock()

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/confirm-booking", params={"eventId": "sample_event_id"})


    assert response.status_code == 200
    assert response.json() == {"message": "Appointment confirmed successfully!"}

    expected_body = {
        'id': 'sample_event_id',
        'extendedProperties': {'private': {'isConfirmed': 'true'}}
    }
    
    mock_events().update.assert_called_once_with(
        calendarId=CALENDAR_ID,
        eventId="sample_event_id",
        body=expected_body
    )
    mock_events().update().execute.assert_called_once()  

@pytest.mark.anyio
@patch("apps.api.src.main.get_all_events")
@patch("apps.api.src.main.calendar_service.events")
async def test_confirm_booking_already_confirmed(mock_events, mock_get_all_events):
    mock_get_all_events.return_value = [{"id": "sample_event_id"}]
    mock_event = {
        "id": "sample_event_id",
        "extendedProperties": {"private": {"isConfirmed": "true"}}
    }
    mock_events().get.return_value.execute.return_value = mock_event

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/confirm-booking", params={"eventId": "sample_event_id"})
    
    assert response.status_code == 200
    assert response.json() == {"message": "Appointment already confirmed."}

@pytest.mark.anyio
@patch("apps.api.src.main.get_all_events")
@patch("apps.api.src.main.calendar_service.events")
async def test_confirm_booking_invalid_event_id(mock_events, mock_get_all_events):

    mock_get_all_events.return_value = []

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/confirm-booking", params={"eventId": "non_existent_event_id"})


    assert response.status_code == 404
    assert response.json() == {"detail": "Event not found or has been deleted."}


    mock_events().get.assert_not_called()  

# tests for cancelling booking

@pytest.mark.anyio
@patch("apps.api.src.main.calendar_service.events")
async def test_cancel_booking_success(mock_events):

    mock_events().get.return_value.execute.return_value = {"id": "existent_event_id"}


    mock_events().delete.return_value.execute.return_value = {}

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/cancel-booking", params={"eventId": "existent_event_id"})

    assert response.status_code == 200
    assert response.json() == {"message": "Booking canceled successfully."}


@pytest.mark.anyio
@patch("apps.api.src.main.calendar_service.events")
async def test_cancel_booking_event_not_found(mock_events):
    mock_http_error = HttpError(
        resp=MagicMock(status=404), 
        content=b'Not Found'
    )
    mock_events().get.side_effect = mock_http_error

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/cancel-booking", params={"eventId": "non_existent_event_id"})


    assert response.status_code == 404
    assert response.json() == {"detail": "Event not found or has been deleted."}

# tets for checking if user opted out
@pytest.mark.asyncio
@patch("apps.api.src.main.prisma.userreminders", new_callable=AsyncMock)
async def test_check_if_user_opted_out_true(mock_user_reminders):
    mock_user_reminders.find_unique.return_value = AsyncMock(dontRemind=True)
    result = await check_if_user_opted_out("test@example.com")
    assert result is True

@pytest.mark.asyncio
@patch("apps.api.src.main.prisma.userreminders", new_callable=AsyncMock)
async def test_check_if_user_opted_out_false(mock_user_reminders):
    mock_user_reminders.find_unique.return_value = AsyncMock(dontRemind=False)
    result = await check_if_user_opted_out("test@example.com")
    assert result is False

@pytest.mark.asyncio
@patch("apps.api.src.main.prisma.userreminders", new_callable=AsyncMock)
async def test_check_if_user_not_found(mock_user_reminders):
    mock_user_reminders.find_unique.return_value = None
    result = await check_if_user_opted_out("test@example.com")
    assert result is False

@pytest.mark.asyncio
@patch("apps.api.src.main.prisma.userreminders", new_callable=AsyncMock)
async def test_check_if_user_opted_out_invalid_email(mock_user_reminders):
    mock_user_reminders.find_unique.side_effect = ValueError("Invalid email format")
    with pytest.raises(ValueError):
        await check_if_user_opted_out("invalid_email_format")

# tests for getting all events
@pytest.mark.asyncio
@patch("apps.api.src.main.calendar_service.events")
async def test_get_all_events_success(mock_events):
    mock_events().list.return_value.execute.return_value = {
        "items": [{"id": "1"}, {"id": "2"}]
    }
    events = await get_all_events()
    assert events == [{"id": "1"}, {"id": "2"}]

@pytest.mark.asyncio
@patch("apps.api.src.main.calendar_service.events")
async def test_get_all_events_empty_list(mock_events):
    mock_events().list.return_value.execute.return_value = {"items": []}
    events = await get_all_events()
    assert events == []

@pytest.mark.asyncio
@patch("apps.api.src.main.calendar_service.events")
async def test_get_all_events_error(mock_events):
    mock_events().list.return_value.execute.side_effect = HTTPException(status_code=500)
    with pytest.raises(HTTPException):
        await get_all_events()

# tests for getting free time
@patch("apps.api.src.main.get_all_events")
async def test_get_free_time_with_events(mock_get_all_events):
    mock_get_all_events.return_value = [
        {"start": {"dateTime": "2024-10-18T10:00:00"}, "end": {"dateTime": "2024-10-18T10:30:00"}},
        {"start": {"dateTime": "2024-10-18T12:00:00"}, "end": {"dateTime": "2024-10-18T12:30:00"}},
    ]
    selected_date = datetime(2024, 10, 18, 9, 0)
    total_duration = 30
    free_time_slots = await get_free_time_for_date(selected_date, total_duration)
    assert len(free_time_slots) > 0  

@pytest.mark.anyio
async def test_get_free_time_edge_of_business_hours():
    test_date = "2024-10-18"
    service_name = "Women's Haircut"
    

    mocked_events = [
        {"start": {"dateTime": "2024-10-18T10:00:00+02:00"}, "end": {"dateTime": "2024-10-18T11:00:00+02:00"}},
        {"start": {"dateTime": "2024-10-18T14:00:00+02:00"}, "end": {"dateTime": "2024-10-18T15:00:00+02:00"}},
    ]
    

    with patch("apps.api.src.main.get_all_events", return_value=mocked_events):
        with patch("apps.api.src.main.service_durations", service_durations):
            async with AsyncClient(app=app, base_url="http://test") as ac:
                response = await ac.get("/get-free-time", params={"date": test_date, "services": service_name})
    

            assert response.status_code == 200
            slots = response.json()
            

            business_start = datetime.strptime("09:00 AM", "%I:%M %p")
            business_end = datetime.strptime("06:00 PM", "%I:%M %p")
            
            for slot in slots:
                start_time, end_time = slot.split(" - ")
                start = datetime.strptime(start_time, "%I:%M %p")
                end = datetime.strptime(end_time, "%I:%M %p")
                duration = (end - start).total_seconds() / 60
                assert business_start <= start <= business_end
                assert business_start <= end <= business_end
                assert duration == service_durations[service_name]