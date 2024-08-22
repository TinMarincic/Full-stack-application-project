from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List
from starlette.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

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

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

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

@app.post("/email")
async def send_contact_form(contact_form: ContactForm) -> JSONResponse:
    html = f"""
    <p><strong>Name:</strong> {contact_form.name}</p>
    <p><strong>Email:</strong> {contact_form.email}</p>
    <p><strong>Message:</strong><br/>{contact_form.message}</p>
    """

    message = MessageSchema(
        subject=f"Message from {contact_form.name}",
        recipients=[os.getenv("EMAIL")],  # Receiver's email
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})
