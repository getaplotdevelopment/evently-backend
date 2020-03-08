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
  checkProfile
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
  '/:organizerId',
  asyncHandler(checkToken),
  asyncHandler(checkUserProfile),
  asyncHandler(auth),
  asyncHandler(profile.getUserProfile)
);
router.put(
  '/',
  upload.array('profilePhotos', 2),
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(profile.updateYourProfile)
);

export default router;
