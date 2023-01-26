const nodemailer = require('nodemailer');
//create a transporter
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define the email options
  const mailOption = {
    from: 'udo <hello@udo.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send the email
  transporter.sendMail(mailOption);
};

module.exports = { sendEmail };
