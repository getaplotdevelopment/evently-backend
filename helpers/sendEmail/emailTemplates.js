import html from './template/template';

const getRole = (role, urls) => {
  const {
    verification,
    resetPassword,
    freeEventCancellation,
    paidEventCancellation
  } = emailTemplates;

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
  freeEventCancellation.html = html(
    'Free Event cancellation',
    'THHE EVENT HAS BEEN CANCELLED',
    'To learn more about the cancellation',
    role,
    urls
  );
  paidEventCancellation.html = html(
    'Paid Event cancellation',
    'THHE EVENT HAS BEEN CANCELLED',
    'To learn more about the cancellation',
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
  },
  freeEventCancellation: {
    from: '',
    to: '',
    subject: 'Free Event cancellation'
  },
  paidEventCancellation: {
    from: '',
    to: '',
    subject: 'Paid Event cancellation'
  }
};

export { emailTemplates, getRole };
