import { check, validationResult } from 'express-validator';

const validateUser = [
  check('firstName', 'firstName is required')
    .not()
    .isEmpty(),
  check('lastName', 'lastName is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please provide a password with 6 or more characters'
  ).isLength({
    min: 6
  })
];
const validateProfile = [
  check('accountName', 'accountName is required')
    .not()
    .isEmpty(),
  check('location', 'location is required')
    .not()
    .isEmpty(),
  check('preferences', 'preferences is required')
    .not()
    .isEmpty(),
  check('accountType', 'accountType is required')
    .not()
    .isEmpty()
];
const validateUserLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required')
    .not()
    .isEmpty()
    .isLength({
      min: 6
    })
];
const validatePassword = [
  check('password', 'Your password should have at least 6 characters')
    .not()
    .isEmpty()
    .isLength({
      min: 6
    })
];
const validateChangePassword = [
  check('oldPassword', 'Old password is required')
    .not()
    .isEmpty(),
  check(
    'oldPassword',
    'Old password should have at least a length of 6 characters'
  ).isLength({
    min: 6
  }),
  check(
    'newPassword',
    'Your password should have at least 6 characters'
  ).isLength({
    min: 6
  }),
  check('newPassword', 'New password is required')
    .not()
    .isEmpty()
];
const validateEvent = [
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('description', 'Description is required')
    .not()
    .isEmpty(),
  check('startDate', 'startDate is required')
    .not()
    .isEmpty(),
  check('finishDate', 'finishDate is required')
    .not()
    .isEmpty()
];
const validateRole = [
  check('designation', 'Designation is required')
    .not()
    .isEmpty()
];
const validateTicketCategory = [
  check('designation', 'Ticket category designation is required')
    .not()
    .isEmpty()
];
const validateTicket = [
  check(
    'price',
    'Ticket Prices are required e.g [{"vvip": 9000, "table": 80000, "regular": 7000, "vip": 5000}]'
  )
    .not()
    .isEmpty(),
  check(
    'category',
    'Ticket categories are required e.g [{"vvip": 2, "table": 3, "vip": 4}]'
  )
    .not()
    .isEmpty()
];
const validateFreePayment = [
  check('ticket_ids', 'Ticket id(array of numbers) is required')
    .not()
    .isEmpty()
    .isArray(),
  check('username', 'Username is required')
    .not()
    .isEmpty(),
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('phone_number', 'Phone number is required')
    .not()
    .isEmpty()
];
const validatePaidPayment = [
  check('ticket_ids', 'Ticket id(Number) is required')
    .not()
    .isEmpty(),
  check('fullname', 'Full Name is required')
    .not()
    .isEmpty(),
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('phone_number', 'Phone number is required')
    .not()
    .isEmpty(),
  check('currency', 'Currency is required')
    .not()
    .isEmpty(),
  check('amount', 'Amount is required')
    .not()
    .isEmpty()
];
const validations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, errors: errors.array() });
  }
  next();
};

const validateFeedback = [
  check('subject', 'Subject is required')
    .not()
    .isEmpty(),
  check('content', 'Content is required')
    .not()
    .isEmpty()
];
const validateComment = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];
const validateExperience = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

const ValidateRedirectUrl = [
  check('redirectUrl', 'redirect url is required')
    .not()
    .isEmpty()
];

export {
  validateUser,
  validations,
  validateUserLogin,
  validateProfile,
  validatePassword,
  validateEvent,
  validateChangePassword,
  validateRole,
  validateTicketCategory,
  validateTicket,
  validateFeedback,
  validateFreePayment,
  validatePaidPayment,
  validateComment,
  validateExperience,
  ValidateRedirectUrl
};
