from typing import Union

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://full-stack-application-project-web.vercel.app/",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/appointments/{appointment_id}")
def get_appointment(appointment_id: int, q: Union[str, None] = None):
    return {"appointment_id": appointment_id, "q": q}