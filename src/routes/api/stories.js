import express from 'express';
import multer from 'multer';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import checkToken from '../../middleware/users/checkToken';
import Stories from '../../controllers/stories';
import auth from '../../middleware/users/auth';

const upload = multer();

const stories = new Stories();

const router = express.Router();

router.post(
  '/',
  asyncHandler(checkToken),
  asyncHandler(auth),
  upload.single('picture'),
  asyncHandler(stories.createStory)
);
router.get(
  '/',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(stories.getAllStories)
);
router.get(
  '/:storyId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(stories.getOneStory)
);

export default router;
