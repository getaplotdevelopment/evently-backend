import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth';
import Profile from '../../controllers/profile';
import {
  validateProfile,
  validations
} from '../../middleware/validations/validateAll';
import upload from '../../helpers/fileUploadConfig/multer';
import { checkUserProfile } from '../../middleware/users/checkUser';

const profile = new Profile();

const router = express.Router();
// const upload = multer();

router.post(
  '/',
  upload.array('profilePhotos', 2),
  asyncHandler(authUser),
  validateProfile,
  validations,
  asyncHandler(profile.createProfile)
);
router.get(
  '/me',
  asyncHandler(auth),
  asyncHandler(profile.getCurrentUserProfile)
);
router.get(
  '/:organizerId',
  asyncHandler(checkUserProfile),
  asyncHandler(authUser),
  asyncHandler(profile.getUserProfile)
);
router.put(
  '/',
  upload.array('profilePhotos', 2),
  asyncHandler(authUser),
  asyncHandler(profile.updateYourProfile)
);

export default router;
