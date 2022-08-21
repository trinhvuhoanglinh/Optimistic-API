const mail = require('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
const mailConfig = require('./config-const')


const sendMail = async (to, subject, otp) => {

    try {
        sgMail.setApiKey(mailConfig.MAIL_SG_KEY);
        const msg = {
            to: to,
            from: 'trinhthevils@gmail.com', // Không đổi, phải gửi từ đây mới được
            subject: subject,
            text: 'http://localhost:3000/verify?email=' + to + "&otp=" + otp,
        }
        sgMail.send(msg)     

    } catch(error) {
        return(error)
    }   
}

module.exports = {
    sendMail,
}