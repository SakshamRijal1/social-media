//whenever we send the connection request it must send the email to the user.we will send the email that we have received the connection request.



//we will sent the emaill by smtp smtp is simple mail transfrer protocal
import nodemailer from 'nodemailer'
//create transporter object using smtp setting


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendEmail=async({to,subject,body})=>{
  const response=await transporter.sendMail({
    from:process.env.SENDER_EMAIL,
    to,
    subject,
    html:body
  })
  return response
}
export default sendEmail;
