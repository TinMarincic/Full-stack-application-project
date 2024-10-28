import pytest
from unittest.mock import patch
from datetime import datetime, timedelta
from pytz import utc
from apps.api.src.main import check_for_reminders  


service_frequencies = {
    "Men's Haircut": 4,  
    "Women's Haircut": 8  
}

@pytest.mark.asyncio
@patch('apps.api.src.main.calendar_service.events')
@patch('apps.api.src.main.send_email_reminder')
@patch('apps.api.src.main.datetime')
async def test_check_for_reminders(mock_datetime, mock_send_email_reminder, mock_events):
    # Mock time
    mock_now = datetime.now(tz=utc)
    mock_datetime.now.return_value = mock_now
    
    # Mock data
    mock_events().list().execute.return_value = {
        'items': [
            {
                'extendedProperties': {
                    'private': {
                        'email': 'test@example.com'
                    }
                },
                'summary': "Men's Haircut",
                'start': {
                    'dateTime': (mock_now - timedelta(weeks=3)).isoformat() 
                }
            },
            {
                'extendedProperties': {
                    'private': {
                        'email': 'user@example.com'
                    }
                },
                'summary': "Women's Haircut",
                'start': {
                    'dateTime': (mock_now - timedelta(weeks=9)).isoformat()  
                }
            }
        ]
    }
    

    await check_for_reminders()
    
    print("send_email_reminder calls:", mock_send_email_reminder.call_args_list)

    mock_send_email_reminder.assert_any_call('user@example.com', "Women's Haircut")

    assert not any(call.args == ('test@example.com', "Men's Haircut") for call in mock_send_email_reminder.call_args_list)

    assert mock_send_email_reminder.call_count == 1  
