import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import auth from '../../middleware/users/auth';
import authUser from '../../middleware/users/authUser';
import adminOrOrganizer from '../../middleware/users/adminAndOrganizer';
import TicketCategory from '../../controllers/ticketCategory';
import {
  validations,
  validateTicketCategory
} from '../../middleware/validations/validateAll';
import {
  checkCategoryDesignation,
  checkCategory
} from '../../middleware/tickets/category';

const category = new TicketCategory();

const router = express.Router();

router.post(
  '/',
  asyncHandler(adminOrOrganizer),
  validateTicketCategory,
  validations,
  asyncHandler(checkCategoryDesignation),
  asyncHandler(category.createTicketCategory)
);
router.get(
  '/',
  asyncHandler(auth),
  asyncHandler(category.getAllTicketCategory)
);
router.get(
  '/:ticketCategoryId',
  asyncHandler(auth),
  asyncHandler(checkCategory),
  asyncHandler(category.getOneTicketCategory)
);
router.put(
  '/:ticketCategoryId',
  asyncHandler(adminOrOrganizer),
  validateTicketCategory,
  validations,
  asyncHandler(checkCategory),
  asyncHandler(category.updateTicketCategory)
);

export default router;
