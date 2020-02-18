import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import isAdmin from '../../middleware/users/isAdminAuth';
import auth from '../../middleware/users/auth';
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
  asyncHandler(isAdmin),
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
  asyncHandler(isAdmin),
  validateTicketCategory,
  validations,
  asyncHandler(checkCategory),
  asyncHandler(category.updateTicketCategory)
);

export default router;
