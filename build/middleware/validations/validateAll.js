"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidateRedirectUrl = exports.validateExperience = exports.validateComment = exports.validatePaidPayment = exports.validateFreePayment = exports.validateFeedback = exports.validateTicket = exports.validateTicketCategory = exports.validateRole = exports.validateChangePassword = exports.validateEvent = exports.validatePassword = exports.validateProfile = exports.validateUserLogin = exports.validations = exports.validateUser = undefined;

var _expressValidator = require("express-validator");

const validateUser = [(0, _expressValidator.check)('firstName', 'firstName is required').not().isEmpty(), (0, _expressValidator.check)('lastName', 'lastName is required').not().isEmpty(), (0, _expressValidator.check)('email', 'Please include a valid email').isEmail(), (0, _expressValidator.check)('password', 'Please provide a password with 6 or more characters').isLength({
  min: 6
})];
const validateProfile = [(0, _expressValidator.check)('accountName', 'accountName is required').not().isEmpty(), (0, _expressValidator.check)('location', 'location is required').not().isEmpty(), (0, _expressValidator.check)('preferences', 'preferences is required').not().isEmpty(), (0, _expressValidator.check)('accountType', 'accountType is required').not().isEmpty()];
const validateUserLogin = [(0, _expressValidator.check)('email', 'Please include a valid email').isEmail(), (0, _expressValidator.check)('password', 'Password is required').not().isEmpty().isLength({
  min: 6
})];
const validatePassword = [(0, _expressValidator.check)('password', 'Your password should have at least 6 characters').not().isEmpty().isLength({
  min: 6
})];
const validateChangePassword = [(0, _expressValidator.check)('oldPassword', 'Old password is required').not().isEmpty(), (0, _expressValidator.check)('oldPassword', 'Old password should have at least a length of 6 characters').isLength({
  min: 6
}), (0, _expressValidator.check)('newPassword', 'Your password should have at least 6 characters').isLength({
  min: 6
}), (0, _expressValidator.check)('newPassword', 'New password is required').not().isEmpty()];
const validateEvent = [(0, _expressValidator.check)('title', 'Title is required').not().isEmpty(), (0, _expressValidator.check)('description', 'Description is required').not().isEmpty(), (0, _expressValidator.check)('startDate', 'startDate is required').not().isEmpty(), (0, _expressValidator.check)('finishDate', 'finishDate is required').not().isEmpty()];
const validateRole = [(0, _expressValidator.check)('designation', 'Designation is required').not().isEmpty()];
const validateTicketCategory = [(0, _expressValidator.check)('designation', 'Ticket category designation is required').not().isEmpty()];
const validateTicket = [(0, _expressValidator.check)('price', 'Ticket Prices are required e.g [{"vvip": 9000, "table": 80000, "regular": 7000, "vip": 5000}]').not().isEmpty(), (0, _expressValidator.check)('category', 'Ticket categories are required e.g [{"vvip": 2, "table": 3, "vip": 4}]').not().isEmpty()];
const validateFreePayment = [(0, _expressValidator.check)('ticket_ids', 'Ticket id(array of numbers) is required').not().isEmpty().isArray(), (0, _expressValidator.check)('username', 'Username is required').not().isEmpty(), (0, _expressValidator.check)('email', 'Email is required').not().isEmpty(), (0, _expressValidator.check)('phone_number', 'Phone number is required').not().isEmpty()];
const validatePaidPayment = [(0, _expressValidator.check)('ticket_ids', 'Ticket id(Number) is required').not().isEmpty(), (0, _expressValidator.check)('fullname', 'Full Name is required').not().isEmpty(), (0, _expressValidator.check)('email', 'Email is required').not().isEmpty(), (0, _expressValidator.check)('phone_number', 'Phone number is required').not().isEmpty(), (0, _expressValidator.check)('currency', 'Currency is required').not().isEmpty(), (0, _expressValidator.check)('amount', 'Amount is required').not().isEmpty()];

const validations = (req, res, next) => {
  const errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array()
    });
  }

  next();
};

const validateFeedback = [(0, _expressValidator.check)('subject', 'Subject is required').not().isEmpty(), (0, _expressValidator.check)('content', 'Content is required').not().isEmpty()];
const validateComment = [(0, _expressValidator.check)('text', 'Text is required').not().isEmpty()];
const validateExperience = [(0, _expressValidator.check)('text', 'Text is required').not().isEmpty()];
const ValidateRedirectUrl = [(0, _expressValidator.check)('redirectUrl', 'redirect url is required').not().isEmpty()];
exports.validateUser = validateUser;
exports.validations = validations;
exports.validateUserLogin = validateUserLogin;
exports.validateProfile = validateProfile;
exports.validatePassword = validatePassword;
exports.validateEvent = validateEvent;
exports.validateChangePassword = validateChangePassword;
exports.validateRole = validateRole;
exports.validateTicketCategory = validateTicketCategory;
exports.validateTicket = validateTicket;
exports.validateFeedback = validateFeedback;
exports.validateFreePayment = validateFreePayment;
exports.validatePaidPayment = validatePaidPayment;
exports.validateComment = validateComment;
exports.validateExperience = validateExperience;
exports.ValidateRedirectUrl = ValidateRedirectUrl;