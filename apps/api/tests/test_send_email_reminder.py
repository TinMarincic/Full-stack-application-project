import pytest
from unittest import mock
from unittest.mock import patch
from apps.api.src.main import send_email_reminder

@pytest.mark.parametrize("recipient_email, service_name", [
    ("test@example.com", "Men's Haircut, Men's Beard"),
    ("user@example.com", "Women's Haircut"),
])
@patch('apps.api.src.main.smtplib.SMTP_SSL')
def test_send_email_reminder(mock_smtp, recipient_email, service_name):
    mock_server = mock_smtp.return_value.__enter__.return_value
    send_email_reminder(recipient_email, service_name)


    mock_smtp.assert_called_once_with('smtp.gmail.com', 465, context=mock.ANY)
    mock_server.login.assert_called_once()
    mock_server.sendmail.assert_called_once()
