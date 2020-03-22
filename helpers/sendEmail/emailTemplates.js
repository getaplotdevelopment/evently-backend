import html from './template/template';

const getRole = (role, urls) => {
  const { verification, resetPassword } = emailTemplates;

  resetPassword.html = html(
    'Reset password',
    'RESET PASSWORD',
    'requested a password reset for your evently account',
    role,
    urls
  );
  verification.html = html(
    'Email verification',
    'ACTIVATE YOUR ACCOUNT',
    'to activate your evently account',
    role,
    urls
  );

  return role;
};

const emailTemplates = {
  resetPassword: {
    from: '',
    to: '',
    subject: 'Password Reset'
  },
  verification: {
    from: '',
    to: '',
    subject: 'Email Verification'
  }
};

export { emailTemplates, getRole };
