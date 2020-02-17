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
  check('password', 'Password is required')
    .not()
    .isEmpty()
    .isLength({
      min: 6
    })
];
const validateChangePassword = [
  check('oldPassword', 'Old password is required')
    .not()
    .isEmpty()
    .isLength({
      min: 6
    }),
  check('newPassword', 'new password is required')
    .not()
    .isEmpty()
    .isLength({
      min: 6
    })
];
const validateEvent = [
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('description', 'Description is required')
    .not()
    .isEmpty(),
  check('body', 'Body is required')
    .not()
    .isEmpty()
];
const validateRole = [
  check('designation', 'Designation is required')
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

export {
  validateUser,
  validations,
  validateUserLogin,
  validateProfile,
  validatePassword,
  validateEvent,
  validateChangePassword,
  validateRole
};
