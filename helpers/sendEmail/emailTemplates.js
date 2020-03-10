import dotenv from 'dotenv/config';

const url =
  process.env.NODE_ENV === 'production'
    ? `${process.env.PRODUCTION_URL}`
    : `${process.env.APP_URL}`;
const clientUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.FRONTEND_PRODUCTION_URL}`
    : `${process.env.FRONTEND_APP_URL}`;

const emailTemplates = {
  resetPassword: {
    from: '',
    to: '',
    subject: 'Password Reset',
    html: `<h1 style="color: #444; margin-left: 20px;"> Welcome back to Evently </br> Reset your password </h1>
    <p style="color: #555; margin-left: 20px; font-size 14px"> Lost your password? click on the link below to reset it </p>
    <a style="background-color: #61a46e; padding: 12px 15px 12px; color: #eee; font-size: 16px; text-decoration:none; margin-left:20px; cursor: pointer" href="${clientUrl}/admin/auth/set-new-password?token=$token"> Reset Password </a>`
  },
  verification: {
    from: '',
    to: '',
    subject: 'Email Verification',
    html: `<h1 style="color: #444; margin-left: 20px;">Welcome to Evently</h1>
<p style="color: #555; margin-left: 20px; font-size: 14px">Thank you for signing to Evently. Please click on the button below to activate your account.</p><br>
<a style="background-color: #61a46e; padding: 12px 15px 12px 15px; color: #eee; font-size: 16px; text-decoration: none; margin-left: 20px; cursor: pointer;" href="${clientUrl}/admin/auth/verify/$token">Activate account</a>`
  }
};

export { emailTemplates };
