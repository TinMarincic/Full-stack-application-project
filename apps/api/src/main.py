
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from fastapi import FastAPI
from dateutil import parser
import ssl
import httplib2
from pytz import timezone
import schedule
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pytz import utc

ssl_context = ssl.create_default_context()
http = httplib2.Http(ca_certs=ssl_context)

# environment variables 
load_dotenv()

scheduler = AsyncIOScheduler(timezone=utc)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

@scheduler.scheduled_job('cron', second="*/1")
async def fetch_current_time():
    print('Fetching current time...')

# CORS setup 
origins = [
    "https://full-stack-application-project-web.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#service account information (should use .env variables later)
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

# credentials
credentials = service_account.Credentials.from_service_account_info(
    SERVICE_ACCOUNT_INFO,
    scopes=["https://www.googleapis.com/auth/calendar"]
)

# Google Calendar API client
calendar_service = build('calendar', 'v3', credentials=credentials)

CALENDAR_ID = "bella.frizerski.salon@gmail.com"

service_durations = {
  "Women's Haircut": 45,
  "Shampoo Blow Dry": 30,
  "Full Hair Color": 120,
  "Highlights": 90,
  "Men's Haircut": 30,
  "Men's Beard": 20,
  "Children's Haircut": 20,
}


async def get_all_events():
    events_result = calendar_service.events().list(
        calendarId=CALENDAR_ID,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    events = events_result.get('items', [])
    return events

ba_tz = timezone('Europe/Sarajevo')


async def get_free_time_for_date(selected_date: datetime, total_duration: int):
    selected_date = selected_date.astimezone(ba_tz)

    events = await get_all_events()

    sorted_events = sorted(
        (e for e in events if parser.isoparse(e["start"]["dateTime"]).astimezone(ba_tz).date() == selected_date.date()), 
        key=lambda e: e["start"]["dateTime"]
    )

    free_timestamps = []
    opening_time = selected_date.replace(hour=9, minute=0, second=0, microsecond=0)  # 9 AM
    closing_time = selected_date.replace(hour=18, minute=0, second=0, microsecond=0)  # 6 PM

    last_end_time = opening_time

    for event in sorted_events:    
        event_start = parser.isoparse(event["start"]["dateTime"]).astimezone(ba_tz)
        event_end = parser.isoparse(event["end"]["dateTime"]).astimezone(ba_tz)

        if last_end_time < event_start:
            free_timestamps.append({
                "start": last_end_time.isoformat(),
                "end": event_start.isoformat(),
            })

        last_end_time = event_end

    if last_end_time < closing_time:
        free_timestamps.append({
            "start": last_end_time.isoformat(),
            "end": closing_time.isoformat(),
        })

    time_slots = []
    for interval in free_timestamps:
        start = parser.isoparse(interval["start"])
        end = parser.isoparse(interval["end"])

        while start + timedelta(minutes=total_duration) <= end:
            next_time = start + timedelta(minutes=total_duration)
            time_slots.append(f"{start.strftime('%I:%M %p')} - {next_time.strftime('%I:%M %p')}")
            start = next_time

    return time_slots


@app.get("/get-free-time")
async def get_free_time_endpoint(date: str, services: str = Query(...)):
    try:
        # Splitting the services string into a list
        service_list = services.split(',')
        
        selected_date = parser.parse(date)
        
        total_duration = 0
        for service in service_list:
            if service.strip() in service_durations:
                total_duration += service_durations[service.strip()]
            else:
                raise HTTPException(status_code=400, detail=f"Invalid service: {service}")
        
        free_time_slots = await get_free_time_for_date(selected_date, total_duration)
        return free_time_slots
    
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Service not found: {str(e)}")