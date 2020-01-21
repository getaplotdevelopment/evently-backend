import express from 'express';
import Users from '../../controllers/users';
import {
  validateUser,
  validations,
  validateUserLogin,
  validatePassword
} from '../../middleware/validations/validateAll';
import { checkUser, checkUserLogin } from '../../middleware/users/checkUser';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';

const users = new Users();

const router = express.Router();

router.post(
  '/',
  validateUser,
  asyncHandler(checkUser),
  validations,
  asyncHandler(users.signup)
);
router.post(
  '/login',
  validateUserLogin,
  asyncHandler(checkUserLogin),
  validations,
  asyncHandler(users.login)
);
router.put(
  '/reset-password',
  validatePassword,
  validations,
  asyncHandler(users.resetPassword)
);
router.get('/verify/:token', asyncHandler(users.activateAccount));
router.post('/check-user', validations, asyncHandler(users.checkUser));
router.post('/send-email', asyncHandler(users.checkEmail));

export default router;
