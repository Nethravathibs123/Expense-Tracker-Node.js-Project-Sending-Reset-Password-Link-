
const uuid = require('uuid');
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo'); // Import TransactionalEmailsApi and SendSmtpEmail
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Forgotpassword = require('../models/password');

const port = 3450;


const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where : { email }});

        if (user) {
            const id = uuid.v4();
            await user.createForgotpassword({ id , active: true });

            const brevoApiKey = process.env.PASSWORD_KEY;

            const apiInstance = new TransactionalEmailsApi();
            const apiKey = apiInstance.authentications['apiKey'];
            apiKey.apiKey = brevoApiKey;

            
            const sendSmtpEmail = new SendSmtpEmail();

            sendSmtpEmail.subject = 'Reset Password Request';
            sendSmtpEmail.htmlContent = `<p>Click the link below to reset your password.</p><a href="http://localhost:${port}/password/resetpassword/${id}">Reset password</a>`;
            sendSmtpEmail.sender = { name: 'Nethravathi B S', email: 'nethranethra451@gmail.com' };
            sendSmtpEmail.to = [{ email }];
            
            apiInstance.sendTransacEmail(sendSmtpEmail)
                .then((data) => {
                    console.log('Email sent successfully:', data);
                    return res.status(200).json({ message: 'Link to reset password sent to your email', success: true });
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send email');
                });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}



module.exports = {
    forgotpassword,
    
}
