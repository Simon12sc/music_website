import nodemailer from "nodemailer";

export const sendMail=async (data)=>{
    
    await nodemailer.createTransport({service:"gmail",auth:{user:process.env.SMPT_MAIL,pass:process.env.SMPT_PASSWORD}}).sendMail({from:process.env.SMTP_EMAIL,to:data.email,subject:data.subject,html:data.message});
}
