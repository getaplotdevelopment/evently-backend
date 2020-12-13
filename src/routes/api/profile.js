import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import auth from '../../middleware/users/auth';
import Profile from '../../controllers/profile';
import {
  validateProfile,
  validations
} from '../../middleware/validations/validateAll';
import upload from '../../helpers/fileUploadConfig/multer';
import {
  checkUserProfile,
  checkProfile,
  checkCurrentProfile
} from '../../middleware/users/checkUser';

const profile = new Profile();

const router = express.Router();

router.post(
  '/',
  upload.array('profilePhotos', 2),
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkProfile),
  validateProfile,
  validations,
  asyncHandler(profile.createProfile)
);
router.get(
  '/me',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(profile.getCurrentUserProfile)
);
router.get(
  '/:userId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkUserProfile),
  asyncHandler(profile.getUserProfile)
);
router.put(
  '/',
  upload.array('profilePhotos', 2),
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkCurrentProfile),
  asyncHandler(profile.updateYourProfile)
);

export default router;
