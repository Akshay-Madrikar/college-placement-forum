const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const sendgridApiKey = 'SG.' + process.env.SEND_GRID_API;
sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'no-reply@collegeplacementforum.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}. Explore companies and discuss placements.`
    });
};

const sendBlockEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'no-reply@collegeplacementforum.com',
        subject: 'User Block Policy',
        text: `Unfortunately we've to block you, ${name}. Please contact placement department for further procedure.`
    });
};

const sendUnblockEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'no-reply@collegeplacementforum.com',
        subject: 'User Block Policy',
        text: `Glad to welcome you back to our app, ${name}!. Enjoy the perks and explore.`
    });
};

const sendResetPasswordEmail = async (email, name, token) => {
    await sgMail.send({
        to: email,
        from: 'no-reply@collegeplacementforum.com',
        subject: 'Reset password',
        html: `<p>Hello ${name}, you've requested to reset your password</p> </br>
        <h4>Click on this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password</h4>`
    });
}; 

module.exports = {
    sendWelcomeEmail,
    sendBlockEmail,
    sendUnblockEmail,
    sendResetPasswordEmail
};