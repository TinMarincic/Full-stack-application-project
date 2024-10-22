import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from apps.api.src.main import app


@pytest.fixture
def anyio_backend():
    return 'asyncio'

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
async def test_confirm_booking_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/confirm-booking", params={"eventId": "sample_event_id"})
    assert response.status_code == 200
    assert response.json()["message"] in ["Appointment confirmed successfully!", "Appointment already confirmed."]

@pytest.mark.anyio
async def test_cancel_booking_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/cancel-booking", params={"eventId": "sample_event_id"})
    assert response.status_code == 200
    assert response.json() == {"message": "Booking canceled successfully."}
