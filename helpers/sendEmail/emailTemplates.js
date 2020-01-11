import dotenv from 'dotenv/config';

const url = `${process.env.APP_URL}${process.env.PORT}`;

const emailTemplates = {
  resetPassword: {
    from: '',
    to: '',
    subject: 'Password Reset',
    html: `<h1 style="color: #444; margin-left: 20px;"> Welcome back to Evently </br> Reset your password </h1>
    <p style="color: #555; margin-left: 20px; font-size 14px"> Lost your password? click on the link below to reset it </p>
    <a style="background-color: #61a46e; padding: 12px 15px 12px; color: #eee; font-size: 16px; text-decoration:none; margin-left:20px; cursor: pointer" href="${url}/reset-password/$token"> Reset Password </a>`
  }
};

export { emailTemplates };
