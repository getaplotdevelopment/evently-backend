"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRole = exports.emailTemplates = undefined;

var _template = require("./template/template");

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRole = (role, redirectUrl, token) => {
  const {
    verification,
    resetPassword,
    freeEventCancellation
  } = emailTemplates;
  resetPassword.html = (0, _template2.default)('Reset password', 'RESET PASSWORD', 'because you have requested a password reset for your evently account', role, redirectUrl, token);
  verification.html = (0, _template2.default)('Email verification', 'ACTIVATE YOUR ACCOUNT', 'because you have to activate your evently account', role, redirectUrl, token);
  freeEventCancellation.html = (0, _template2.default)('Event cancellation', 'CANCEL EVENT', "the free event you've suscribed at has been canceled ");
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
    html: (0, _template2.default)('Event cancellation', 'CANCEL EVENT', "the free event you've suscribed at has been canceled")
  },
  freeEventPostponed: {
    from: '',
    to: '',
    subject: 'Free Event postponed',
    html: (0, _template2.default)('Event postponed', 'EVENT POSTPONED', "the free event you've suscribed at has been postponed")
  },
  freeEventPaused: {
    from: '',
    to: '',
    subject: 'Free Event paused',
    html: (0, _template2.default)('Event paused', 'EVENT PAUSED', "the free event you've suscribed at has been paused")
  },
  freeEventLive: {
    from: '',
    to: '',
    subject: 'Free Event resumed',
    html: (0, _template2.default)('Event resumed', 'EVENT RESUMED', "the free event you've suscribed at has been resumed")
  }
};
exports.emailTemplates = emailTemplates;
exports.getRole = getRole;