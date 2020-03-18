import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import auth from '../../middleware/users/auth';
import checkToken from '../../middleware/users/checkToken';
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
  asyncHandler(checkToken),
  asyncHandler(adminOrOrganizer),
  validateTicketCategory,
  validations,
  asyncHandler(checkCategoryDesignation),
  asyncHandler(category.createTicketCategory)
);
router.get(
  '/',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(category.getAllTicketCategory)
);
router.get(
  '/:ticketCategoryId',
  asyncHandler(checkToken),
  asyncHandler(auth),
  asyncHandler(checkCategory),
  asyncHandler(category.getOneTicketCategory)
);
router.put(
  '/:ticketCategoryId',
  asyncHandler(checkToken),
  asyncHandler(adminOrOrganizer),
  validateTicketCategory,
  validations,
  asyncHandler(checkCategory),
  asyncHandler(category.updateTicketCategory)
);

export default router;
