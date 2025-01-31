import nodemailer from 'nodemailer';

const sendEmail=async(to,subject,html)=>{
    
    const transporter= nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASS
        }
    })

    const info=await transporter.sendMail({
        from:process.env.COMPANY_MAIL,
        to ,
        subject,
        html
    });
    
    
    return info.rejected.length===0?true:false;
}
export default sendEmail;