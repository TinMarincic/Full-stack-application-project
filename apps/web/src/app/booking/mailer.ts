'use server';
const nodemailer = require("nodemailer");
console.log(process.env.GMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  
export async function sendmail(formdata:any){
    console.log(formdata);
  const info = await transporter.sendMail({
    from: `"Maddison Foo Koch 👻" <${process.env.EMAIL}>`, 
    to: "bella.frizerski.salon@gmail.com", 
    subject: "Hello ✔", 
    text: "Hello world?", 
    html: "<b>Hello world?</b>", 
  });

  console.log("Message sent: %s", info.messageId);

}