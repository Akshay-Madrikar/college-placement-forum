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

module.exports = {
    sendWelcomeEmail,
    sendBlockEmail,
    sendUnblockEmail
};