import nodemailer from 'nodemailer';
let transporter;

const createTransporter = async()=>{
    if (transporter) return transporter;

    const testAcc=await nodemailer.createTestAccount();

    transporter=nodemailer.createTransport({
        host:testAcc.smtp.host,
        port:testAcc.smtp.port,
        secure:testAcc.smtp.secure,
        auth:{
            user:testAcc.user,
            pass:testAcc.pass
        }
    });

    console.log("Ethereal Email Preview Login:");
    console.log("Login:", testAcc.user);
    console.log("Password:", testAcc.pass);

    return transporter;
};

export const sendMail = async (to, subject, html) => {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: '"Support" <support@getvantage.co>',
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};
