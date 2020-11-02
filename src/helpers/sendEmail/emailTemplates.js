import html from './template/template';

const getRole = (role, redirectUrl, token) => {
  const { verification, resetPassword, freeEventCancellation } = emailTemplates;

  resetPassword.html = html(
    'Reset password',
    'RESET PASSWORD',
    'because you have requested a password reset for your evently account',
    role,
    redirectUrl,
    token
  );
  verification.html = html(
    'Email verification',
    'ACTIVATE YOUR ACCOUNT',
    'because you have to activate your evently account',
    role,
    redirectUrl,
    token
  );
  freeEventCancellation.html = html(
    'Event cancellation',
    'CANCEL EVENT',
    "the free event you've suscribed at has been canceled "
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
    subject: 'Free Event cancellation',
    html: html(
      'Event cancellation',
      'CANCEL EVENT',
      "the free event you've suscribed at has been canceled"
    )
  },
  freeEventPostponed: {
    from: '',
    to: '',
    subject: 'Free Event postponed',
    html: html(
      'Event postponed',
      'EVENT POSTPONED',
      "the free event you've suscribed at has been postponed"
    )
  },
  freeEventPaused: {
    from: '',
    to: '',
    subject: 'Free Event paused',
    html: html(
      'Event paused',
      'EVENT PAUSED',
      "the free event you've suscribed at has been paused"
    )
  },
  freeEventLive: {
    from: '',
    to: '',
    subject: 'Free Event resumed',
    html: html(
      'Event resumed',
      'EVENT RESUMED',
      "the free event you've suscribed at has been resumed"
    )
  }
};

export { emailTemplates, getRole };
