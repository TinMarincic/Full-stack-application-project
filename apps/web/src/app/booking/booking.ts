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

export async function sendConfirmationEmail(formdata: { email: string; service_type: string; date: string; time: string }) {
  try {
    const info = await transporter.sendMail({
      from: `"Bella Frizerski Salon" <${process.env.EMAIL}>`, 
      to: formdata.email, 
      subject: "Appointment Confirmation", 
      html: `<p>Dear customer,</p>
             <p>Your appointment for <strong>${formdata.service_type}</strong> has been confirmed.</p>
             <p><strong>Date:</strong> ${formdata.date}</p>
             <p><strong>Time:</strong> ${formdata.time}</p>
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

export async function book_appointment(formdata: { email: string; date: Date; service_type: string; time: Date }) {
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
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    // Check if the appointment is being booked in the past
    const now = new Date();
    if (startTime < now) {
      console.error("Cannot book an appointment in the past.");
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
      console.error("Conflict detected: There is already an event at this time.");
      return { success: false, error: "This time slot is already booked." };
    }

    // If there is no conflict, create the event
    const event = {
      summary: formdata.service_type,
      description: `Service: ${formdata.service_type} for ${formdata.email}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Sarajevo",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Sarajevo",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "bella.frizerski.salon@gmail.com",
      requestBody: event,
    });

    console.log("Event created successfully: ", response.data.htmlLink);

    //Send confirmation email  
    const emailResponse = await sendConfirmationEmail({
      email: formdata.email,
      service_type: formdata.service_type,
      date: startTime.toDateString(),
      time: startTime.toTimeString().slice(0, 5), 
    });

    if (!emailResponse.success) {
      console.error("Error sending confirmation email:", emailResponse.error);
    }

    return { success: true, eventLink: response.data.htmlLink };

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while booking:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unknown error occurred:", error);
      return { success: false, error: "An unknown error occurred." };
    }
  }
}
