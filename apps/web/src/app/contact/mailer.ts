'use server';
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

export async function sendmail(formdata: { name: string; email: string; message: string }) {
  try {
    const info = await transporter.sendMail({
      from: `"${formdata.name}" <${process.env.EMAIL}>`, 
      to: "bella.frizerski.salon@gmail.com", 
      subject: `Message from ${formdata.name}`, 
      text: formdata.message, 
      html: `<p><strong>Name:</strong> ${formdata.name}</p>
             <p><strong>Email:</strong> ${formdata.email}</p>
             <p><strong>Message:</strong><br/>${formdata.message}</p>`, 
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unknown error occurred:", error);
      return { success: false, error: "An unknown error occurred." };
    }
  }
}
