import { check, validationResult } from 'express-validator';

const validateUser = [
  check('firstName', 'firstName is required')
    .not()
    .isEmpty(),
  check('lastName', 'lastName is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please password with 6 or more characters').isLength({
    min: 6
  })
];
const validateProfile = [
  check('location', 'location is required')
    .not()
    .isEmpty(),
  check('cardNumber', 'cardNumber is required')
    .not()
    .isEmpty(),
  check('expiryDate', 'expiryDate is required')
    .not()
    .isEmpty(),
  check('cvv', 'cvv is required')
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
const validations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export {
  validateUser,
  validations,
  validateUserLogin,
  validateProfile,
  validateCategory,
  validateProduct,
  validatePassword,
  validateEvent
};
