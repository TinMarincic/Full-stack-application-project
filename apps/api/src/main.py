
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# environment variables loading
load_dotenv()

app = FastAPI()

# CORS setup (vjerovatno dodao viska)
origins = [
    "https://full-stack-application-project-web.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
   "http://127.0.0.1:8000/book_appointment", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email config for smtp server 
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL"), 
    MAIL_PASSWORD=os.getenv("GMAIL_PASSWORD"),  
    MAIL_FROM=os.getenv("EMAIL"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Bella Salon",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# FastMail
fm = FastMail(conf)

# Booking form model
class AppointmentForm(BaseModel):
    gender_age: str
    email: EmailStr
    service_type: str
    datetime: datetime 

#service account information instead of json file (should use .env variables later)
SERVICE_ACCOUNT_INFO = {
    "type": "service_account",
    "project_id": "bella-433413",
    "private_key_id": "45a16034e1aaa8ae746b6fcb16f00b50c9e61c60",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw6Xopc0q8nZwC\nDFw6RUHCI1OuWqapNKY5EZtNdvG41l79otgE6t+87pY1coym6DMYrFr+Og2tjLoB\n/82kFSycmAjmyeTKJgPBzFEtmNlfyGsI0t1EbAx7A2Hwe9Iad8ak8x10ZFs4h8Xa\nGNXrxnJ6ZDQDT2cCc41RRTSaGwaRv6T9HnjFyLPH61aW5mptzrcmEuq8m28IwpgS\nyy1ApZzk4nDIYwQFfWBf8rv9zMeGvRN75FRATRWIeMEDkXuYECNI1NR75CN0oa1z\nz6ci4O74V6UAx1yd1VvCLzvzuiNfvdkCsJFe1VFDRDbNyBbNbPDrZD3ljB1H0XpP\nyew7hE3LAgMBAAECggEATFWRxozetJ/1DtUyflof05rWoqauvtfe2UUFk9k815p4\nBkzblNObkrQH0CwLEIGkeoL0CDoYaMgOAorTuncAdtkLDjoTJD5e5KI6bMhFExUx\nSe9iVgGhKPr+qXtj3tPLvKTCEtSyn6PF9SM+Oqu3/aN65eq+8cnWMjkAR3Zd0Uj8\n1dNcezc6N1J66D8yYY6bLLHtSLvYhplxXaPQbXTcMnYiZdcovGaMn+haJ5xxbTQc\nKtz0vjQIi6kcbfgyVCi8JV5AeXLnmkM2O8qu8m97ZhDQKnXC9XiayN2//kclNSJM\nGQky6YAv5KnWa57kk5V3ylwJt7haaRwLYc2POm/KEQKBgQDxW43U99NcwlHFaBA2\nf+NFhGhFW24fY+wUkHMvfvwXKoQy5xzugx4fjtL09Q8X5anN7C9qKlVpp9kFYBp3\njEwxxyBAU6J1hSxOBYv1XsHKnFlEcX22GFq93fbkuVbafYhk8TW2o5XuhcEnz1/z\n0fehhIvNlqGLHuAyc+k4yoErfwKBgQC7pQogxDz0P7tVJ7hbyrZ6M7L+ODFo5c1o\nH4dkWfUwtWdzKn+MDYp2epGgio4hZF7HexeKgxpkTrFwlGCB5a3Qrf0quqFzTDna\nofLYOyoUW5fp3RuTexuz/EvQoNIrkUw81UQQ+HQwKaSionPwoBO+LO0UK1ZkA0KJ\nJnvcDZnztQKBgG7ZAIvGAiHA8TM7tu6Az812oTjxY+MwzhUnvm8a4AZ3tV13fXch\nau1NeB+eiP8NsG3twlz88ltjBi4M1DsBiWD3Nh21C5Dzx8RRkdTwXwqBwhHIGddO\n2iYHUkP7xyLzsnfBvEyUVuDEN1DkUgo17YgVyutx+eFeHdOuHnfBsY9bAoGBAIDX\nLmAXPh8bT36F2mE0jBzWOLWzUcHL4ED5PRabae568EA0UwWQGp2FRU6tNDAbYbSo\ngR57LHjpS46YYrduQ+2AOc/H+6lWEndbMYpk/VyjE2jhh9i48+med1QVyJlfl7BB\nYw4f+m9DeKau0trKnyO6Z0KtCxF654mSYgNTV3ztAoGBAK+EycoryAYj/k9BV9cX\nCLTau7u3Zc5pI0bbQ0jUM2f7gii4OliWNyZbmGAOPl6TdINTGgxvuhp6urTzca5B\nIeQW4dFDDbhJRm1jmT23XL5DU7lLRptmvyKwpxUsYKa1p4L5J6L/yqkPYRLda8ti\nPrvMIKQsUVrhWeMojkveAzAU\n-----END PRIVATE KEY-----\n",
    "client_email": "bella-calendar@bella-433413.iam.gserviceaccount.com",
    "client_id": "115597619733397074124",
    "token_url": "https://oauth2.googleapis.com/token",
    "universe_domain": "googleapis.com",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bella-calendar%40bella-433413.iam.gserviceaccount.com",
}

# credentials object
credentials = service_account.Credentials.from_service_account_info(
    SERVICE_ACCOUNT_INFO,
    scopes=["https://www.googleapis.com/auth/calendar"]
)

# Google Calendar API client
calendar_service = build('calendar', 'v3', credentials=credentials)

CALENDAR_ID = "bella.frizerski.salon@gmail.com"

@app.post("/book-appointment")
async def book_appointment(appointment_form: AppointmentForm):
    # Get the current time as timezone-aware (ubaceno zbog errora)
    now = datetime.now(timezone.utc)

    # iskocio mi je error pa sam ovo nasao 
    booking_datetime = appointment_form.datetime.replace(tzinfo=timezone.utc)

    # appointment is not in the past
    if booking_datetime < now:
        raise HTTPException(status_code=400, detail="Cannot book an appointment in the past.")

    # time range but assuming 1 hour duration (not great logic)
    start_time = booking_datetime
    end_time = start_time + timedelta(hours=1)

    # double booking
    try:
        events_result = calendar_service.events().list(
            calendarId=CALENDAR_ID,
            timeMin=start_time.isoformat(),
            timeMax=end_time.isoformat(),
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])

        if events:
            raise HTTPException(status_code=400, detail="This time slot is already booked.")
    except Exception as e:
        print(f"Error accessing Google Calendar: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while checking calendar.")

    # event creation part
    event = {
        'summary': appointment_form.service_type,
        'description': f"Service: {appointment_form.service_type} for {appointment_form.email}",
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'Europe/Sarajevo',
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'Europe/Sarajevo',
        },
    }

    try:
        created_event = calendar_service.events().insert(
            calendarId=CALENDAR_ID,
            body=event
        ).execute()
        event_link = created_event.get('htmlLink')
    except Exception as e:
        print(f"Error creating event in Google Calendar: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while creating calendar event.")

    # confirmation email
    html_content = f"""
    <p>Dear Customer,</p>
    <p>Your appointment for <strong>{appointment_form.service_type}</strong> has been confirmed.</p>
    <p><strong>Date:</strong> {start_time.strftime('%Y-%m-%d')}</p>
    <p><strong>Time:</strong> {start_time.strftime('%I:%M %p')}</p>
    <p>Thank you for choosing Bella Frizerski Salon. We look forward to seeing you!</p>
    <p><a href="{event_link}">View Appointment</a></p>
    """

    message = MessageSchema(
        subject="Appointment Confirmation",
        recipients=[appointment_form.email],
        body=html_content,
        subtype=MessageType.html
    )

    # confirmation email
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Error sending confirmation email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send confirmation email.")

    return JSONResponse(status_code=200, content={
        "message": "Appointment booked successfully!",
        "event_link": event_link
    })
