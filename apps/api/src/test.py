
from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pytz import utc

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
