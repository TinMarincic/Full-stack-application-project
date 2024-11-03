import unittest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta, timezone
from apps.api.src.main import check_for_reminders

class TestCheckForReminders(unittest.IsolatedAsyncioTestCase):
    @patch('apps.api.src.main.datetime')
    @patch('apps.api.src.main.calendar_service')
    @patch('apps.api.src.main.send_email_reminder', new_callable=AsyncMock)
    @patch('apps.api.src.main.check_if_user_opted_out')
    async def test_send_reminder(self, mock_opt_out, mock_send_email, mock_calendar_service, mock_datetime):
        now = datetime.now(timezone.utc)
        mock_datetime.now.return_value = now

        # Setting up the mock event
        mock_event = {
            'id': '1',
            'start': {'dateTime': (now - timedelta(hours=5)).isoformat()},
            'extendedProperties': {'private': {'email': 'test@example.com', 'reminderSent': 'false'}},
            'summary': "Men's Haircut"
        }
        mock_calendar_service.events().list().execute.return_value = {'items': [mock_event]}
        mock_opt_out.return_value = False

        # Run the test and verify
        await check_for_reminders()
        
        # Verify email was sent
        mock_send_email.assert_called_once_with('test@example.com', "Men's Haircut")

        # Verify event update to mark reminder as sent
        mock_calendar_service.events().update.assert_called_once()
        updated_event = mock_calendar_service.events().update.call_args[1]['body']
        self.assertEqual(updated_event['extendedProperties']['private']['reminderSent'], 'true')

    @patch('apps.api.src.main.datetime')
    @patch('apps.api.src.main.calendar_service')
    @patch('apps.api.src.main.check_if_user_opted_out')
    async def test_opted_out_user(self, mock_opt_out, mock_calendar_service, mock_datetime):
        # Set up current time
        now = datetime.now(timezone.utc)
        mock_datetime.now.return_value = now

        # Mocking the calendar service response with one event
        mock_event = {
            'id': '1',
            'start': {'dateTime': (now - timedelta(hours=5)).isoformat()},
            'extendedProperties': {'private': {'email': 'opted_out@example.com', 'reminderSent': 'false'}},
            'summary': 'Haircut'
        }
        mock_calendar_service.events().list().execute.return_value = {'items': [mock_event]}

        # Mocking that the user opted out
        mock_opt_out.return_value = True

        # Run the cron job
        await check_for_reminders()

        # Check that the email reminder was not sent
        mock_calendar_service.events().update.assert_not_called()

    @patch('apps.api.src.main.datetime')
    @patch('apps.api.src.main.calendar_service')
    async def test_reminder_already_sent(self, mock_calendar_service, mock_datetime):
        # Set up current time
        now = datetime.now(timezone.utc)
        mock_datetime.now.return_value = now

        # Mocking the calendar service response with one event that already has reminderSent set to 'true'
        mock_event = {
            'id': '1',
            'start': {'dateTime': (now - timedelta(hours=5)).isoformat()},
            'extendedProperties': {'private': {'email': 'test@example.com', 'reminderSent': 'true'}},
            'summary': 'Haircut'
        }
        mock_calendar_service.events().list().execute.return_value = {'items': [mock_event]}

        # Run the cron job
        await check_for_reminders()

        # Check that no update or email was sent
        mock_calendar_service.events().update.assert_not_called()

    @patch('apps.api.src.main.datetime')
    @patch('apps.api.src.main.calendar_service')
    async def test_handle_exception(self, mock_calendar_service, mock_datetime):
        # Mock an exception raised by calendar service
        mock_calendar_service.events().list.side_effect = Exception("API Error")

        # Run the cron job and expect no exceptions to propagate
        try:
            await check_for_reminders()
        except Exception:
            self.fail("check_for_reminders raised an exception unexpectedly!")

if __name__ == '__main__':
    unittest.main()
