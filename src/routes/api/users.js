import express from 'express';
import Users from '../../controllers/users';
import UserActivity from '../../controllers/userActivity';
import {
  validateUser,
  validations,
  validateUserLogin,
  validatePassword,
  validateChangePassword,
  ValidateRedirectUrl
} from '../../middleware/validations/validateAll';
import {
  checkUser,
  checkUserLogin,
  checkPassword,
  isActivate,
  isDeactivated,
  checkUserId,
  checkOrganizerId,
  checkFollowUser
} from '../../middleware/users/checkUser';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import userOrOganizer from '../../middleware/users/organizerOrUser';
import auth from '../../middleware/users/auth';
import isAdminAuth from '../../middleware/users/isAdminAuth';
import checkToken from '../../middleware/users/checkToken';
import deactivateUser from '../../middleware/users/canDeactivateUser';

const users = new Users();
const userActivity = new UserActivity();

const router = express.Router();

router.post(
  '/',
  [validateUser, ValidateRedirectUrl, asyncHandler(checkUser), validations],
  asyncHandler(users.signup)
);
router.post(
  '/login',
  validateUserLogin,
  asyncHandler(checkUserLogin),
  validations,
  asyncHandler(isActivate),
  asyncHandler(isDeactivated),
  asyncHandler(users.login)
);
router.put(
  '/reset-password/:token',
  asyncHandler(checkToken),
  validatePassword,
  validations,
  asyncHandler(users.resetPassword)
);
router.get(
  '/verify/:token',
  asyncHandler(checkToken),
  asyncHandler(users.activateAccount)
);
router.post('/check-user', validations, asyncHandler(users.checkUser));

router.post(
  '/send-email',
  [ValidateRedirectUrl, validations],
  asyncHandler(users.checkEmail)
);
router.post(
  '/resend-email',
  [ValidateRedirectUrl, validations],
  asyncHandler(users.resendVerificationEmail)
);
router.put(
  '/change-password',
  validateChangePassword,
  validations,
  asyncHandler(auth),
  asyncHandler(checkPassword),
  asyncHandler(users.changeCurrentPassword)
);
router.put(
  '/deactivate-user/',
  asyncHandler(deactivateUser),
  asyncHandler(checkUserId),
  asyncHandler(users.deactivateUser)
);
router.put(
  '/reactivate-user/',
  asyncHandler(isAdminAuth),
  // asyncHandler(deactivateUser),
  asyncHandler(checkUserId),
  asyncHandler(users.reactivateUser)
);
router.put(
  '/approve-organizer/',
  asyncHandler(isAdminAuth),
  asyncHandler(checkUserId),
  asyncHandler(checkOrganizerId),
  asyncHandler(users.approveOrganizer)
);

router.patch(
  '/location',
  asyncHandler(auth),
  asyncHandler(users.updateLocation)
);
router.post(
  '/:userId/follow',
  asyncHandler(auth),
  asyncHandler(checkFollowUser),
  asyncHandler(users.followUser)
);
router.put(
  '/:userId/unfollow',
  asyncHandler(auth),
  asyncHandler(checkFollowUser),
  asyncHandler(users.unfollowUser)
);

router.post('/logout', asyncHandler(auth), asyncHandler(users.logout));
router.get(
  '/user-activity/:userId',
  asyncHandler(isAdminAuth),
  asyncHandler(userActivity.getUserActivity)
);
router.get(
  '/admins',
  asyncHandler(isAdminAuth),
  asyncHandler(users.fetchAdminList)
);
router.get(
  '/organizers',
  asyncHandler(isAdminAuth),
  asyncHandler(users.fetchOrgnizers)
);
router.get(
  '/followers',
  asyncHandler(userOrOganizer),
  asyncHandler(users.myFollowers)
);
router.get(
  '/followings',
  asyncHandler(userOrOganizer),
  asyncHandler(users.myFollowings)
);

export default router;
