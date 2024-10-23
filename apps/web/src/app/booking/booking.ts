'use server';
import { google, calendar_v3 } from "googleapis";
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.GMAIL_PASSWORD, 
  },
});

const serviceDurations: { [key: string]: number } = {
  "Women's Haircut": 45,
  "Shampoo Blow Dry": 30,
  "Full Hair Color": 120,
  "Highlights": 90,
  "Men's Haircut": 30,
  "Men's Beard": 20,
  "Children's Haircut": 20,
};
export async function sendConfirmationEmail(formdata: { email: string; service_type: string[]; date: string; time: string, eventId: string }) {
  const servicesList = formdata.service_type.join(", ");
  const confirmationButton = `http://127.0.0.1:8000/confirm-booking?eventId=${formdata.eventId}`;
  const cancellationButton = `http://127.0.0.1:8000/cancel-booking?eventId=${formdata.eventId}`;

  try {
    const info = await transporter.sendMail({
      from: `"Bella Frizerski Salon" <${process.env.EMAIL}>`, 
      to: formdata.email, 
      subject: "Appointment Confirmation", 
      html: `<p>Dear customer,</p>
             <p>Your appointment for the following services has been confirmed:</p>
             <p><strong>Services:</strong> ${servicesList}</p>
             <p><strong>Date:</strong> ${formdata.date}</p>
             <p><strong>Time:</strong> ${formdata.time}</p>
             <p><a href="${confirmationButton}" style="background-color: #FDD835; color: white; padding: 10px 20px; text-align: center; radius: 20px; text-decoration: none; display: inline-block; font-size: 16px;">Confirm Appointment</a></p>
             <p>If you want to cancel your appointment, please do it in a timely manner!</p>
             <p><a href="${cancellationButton}" style="background-color: red; color: white; padding: 10px 20px; text-align: center; radius: 20px; text-decoration: none; display: inline-block; font-size: 16px;">Cancel Appointment</a></p>
             <p>Thank you for choosing Bella Frizerski Salon. We look forward to seeing you!</p>`, 
    });

    console.log("Confirmation email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending confirmation email:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unknown error occurred:", error);
      return { success: false, error: "An unknown error occurred." };
    }
  }
}

export async function sendReminderEmail(formdata: { email: string; service_type: string; weeks_since_service: number; service_frequency: number }) {
  const bookingLink = `http://localhost:3000/booking`;

  try {
    const info = await transporter.sendMail({
      from: `"Bella Frizerski Salon" <${process.env.EMAIL}>`, 
      to: formdata.email, 
      subject: `Time for your next ${formdata.service_type}!`, 
      html: `<p>Dear customer,</p>
             <p>It's been ${formdata.weeks_since_service} weeks since your last ${formdata.service_type}.</p>
             <p>At Bella Frizerski Salon, we recommend scheduling your ${formdata.service_type} every ${formdata.service_frequency} weeks.</p>
             <p>We'd love to see you again! <a href="${bookingLink}" style="background-color: #FDD835; color: white; padding: 10px 20px; text-align: center; radius: 20px; text-decoration: none; display: inline-block; font-size: 16px;">Click here to book your next appointment</a>.</p>
             <p>Thank you for choosing Bella Frizerski Salon!</p>`, 
    });

    console.log("Reminder email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending reminder email:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unknown error occurred:", error);
      return { success: false, error: "An unknown error occurred." };
    }
  }
}

export async function book_appointment(formdata: { email: string; date: Date; service_type: string[]; time: Date }) {
  try {
    const auth = await google.auth.getClient({
      projectId: "bella-433413",
      credentials: {
        type: "service_account",
       private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw6Xopc0q8nZwC\nDFw6RUHCI1OuWqapNKY5EZtNdvG41l79otgE6t+87pY1coym6DMYrFr+Og2tjLoB\n/82kFSycmAjmyeTKJgPBzFEtmNlfyGsI0t1EbAx7A2Hwe9Iad8ak8x10ZFs4h8Xa\nGNXrxnJ6ZDQDT2cCc41RRTSaGwaRv6T9HnjFyLPH61aW5mptzrcmEuq8m28IwpgS\nyy1ApZzk4nDIYwQFfWBf8rv9zMeGvRN75FRATRWIeMEDkXuYECNI1NR75CN0oa1z\nz6ci4O74V6UAx1yd1VvCLzvzuiNfvdkCsJFe1VFDRDbNyBbNbPDrZD3ljB1H0XpP\nyew7hE3LAgMBAAECggEATFWRxozetJ/1DtUyflof05rWoqauvtfe2UUFk9k815p4\nBkzblNObkrQH0CwLEIGkeoL0CDoYaMgOAorTuncAdtkLDjoTJD5e5KI6bMhFExUx\nSe9iVgGhKPr+qXtj3tPLvKTCEtSyn6PF9SM+Oqu3/aN65eq+8cnWMjkAR3Zd0Uj8\n1dNcezc6N1J66D8yYY6bLLHtSLvYhplxXaPQbXTcMnYiZdcovGaMn+haJ5xxbTQc\nKtz0vjQIi6kcbfgyVCi8JV5AeXLnmkM2O8qu8m97ZhDQKnXC9XiayN2//kclNSJM\nGQky6YAv5KnWa57kk5V3ylwJt7haaRwLYc2POm/KEQKBgQDxW43U99NcwlHFaBA2\nf+NFhGhFW24fY+wUkHMvfvwXKoQy5xzugx4fjtL09Q8X5anN7C9qKlVpp9kFYBp3\njEwxxyBAU6J1hSxOBYv1XsHKnFlEcX22GFq93fbkuVbafYhk8TW2o5XuhcEnz1/z\n0fehhIvNlqGLHuAyc+k4yoErfwKBgQC7pQogxDz0P7tVJ7hbyrZ6M7L+ODFo5c1o\nH4dkWfUwtWdzKn+MDYp2epGgio4hZF7HexeKgxpkTrFwlGCB5a3Qrf0quqFzTDna\nofLYOyoUW5fp3RuTexuz/EvQoNIrkUw81UQQ+HQwKaSionPwoBO+LO0UK1ZkA0KJ\nJnvcDZnztQKBgG7ZAIvGAiHA8TM7tu6Az812oTjxY+MwzhUnvm8a4AZ3tV13fXch\nau1NeB+eiP8NsG3twlz88ltjBi4M1DsBiWD3Nh21C5Dzx8RRkdTwXwqBwhHIGddO\n2iYHUkP7xyLzsnfBvEyUVuDEN1DkUgo17YgVyutx+eFeHdOuHnfBsY9bAoGBAIDX\nLmAXPh8bT36F2mE0jBzWOLWzUcHL4ED5PRabae568EA0UwWQGp2FRU6tNDAbYbSo\ngR57LHjpS46YYrduQ+2AOc/H+6lWEndbMYpk/VyjE2jhh9i48+med1QVyJlfl7BB\nYw4f+m9DeKau0trKnyO6Z0KtCxF654mSYgNTV3ztAoGBAK+EycoryAYj/k9BV9cX\nCLTau7u3Zc5pI0bbQ0jUM2f7gii4OliWNyZbmGAOPl6TdINTGgxvuhp6urTzca5B\nIeQW4dFDDbhJRm1jmT23XL5DU7lLRptmvyKwpxUsYKa1p4L5J6L/yqkPYRLda8ti\nPrvMIKQsUVrhWeMojkveAzAU\n-----END PRIVATE KEY-----\n",
        client_email: "bella-calendar@bella-433413.iam.gserviceaccount.com",
        client_id: "115597619733397074124",
        token_url: "https://oauth2.googleapis.com/token",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/calendar"]
    });

    const calendar = new calendar_v3.Calendar({ auth });
    const startTime = new Date(formdata.date);
    startTime.setHours(formdata.time.getHours(), formdata.time.getMinutes());

    // Calculate total duration for services
    const totalDuration = formdata.service_type.reduce((total, service) => {
      return total + (serviceDurations[service] || 60);
    }, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + totalDuration);

        // Check if the appointment is in the past
    const now = new Date();
      if (startTime < now) {
        return { success: false, error: "Cannot book an appointment in the past." };
      }
        
          // Check for conflicts
    const conflictCheck = await calendar.events.list({
      calendarId: "bella.frizerski.salon@gmail.com",
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
    });

    if (conflictCheck.data.items?.length) {
      return { success: false, error: "This time slot is already booked." };
    }

    const servicesList = formdata.service_type.join(", ");
    const event = {
      summary: `${servicesList}`,
      description: `Services: ${servicesList}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Sarajevo",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Sarajevo",
      },
      extendedProperties: {
        private: {
          isConfirmed: "false",  
          email: formdata.email,
          reminderSent: "false",
        },
      },
    };

    const newEvent = await calendar.events.insert({
      calendarId: "bella.frizerski.salon@gmail.com",
      requestBody: event,
    });

    console.log("Event created with metadata: %s", newEvent.data.htmlLink);


    if (newEvent?.data?.id) {
      await sendConfirmationEmail({
        email: formdata.email,
        service_type: formdata.service_type,
        date: startTime.toDateString(),
        time: startTime.toTimeString(),
        eventId: newEvent.data.id
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error booking appointment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}