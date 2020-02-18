import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import isAdmin from '../../middleware/users/isAdminAuth';
import Roles from '../../controllers/roles';
import {
  validations,
  validateRole
} from '../../middleware/validations/validateAll';
import {
  checkRole,
  checkRoleDesignation
} from '../../middleware/roles/checkRole';

const roles = new Roles();

const router = express.Router();

router.post(
  '/',
  asyncHandler(isAdmin),
  validateRole,
  validations,
  asyncHandler(checkRoleDesignation),
  asyncHandler(roles.createRole)
);
router.get('/', asyncHandler(isAdmin), asyncHandler(roles.getAllRoles));
router.get(
  '/:roleId',
  asyncHandler(isAdmin),
  asyncHandler(checkRole),
  asyncHandler(roles.getOneRole)
);
router.put(
  '/:roleId',
  asyncHandler(isAdmin),
  validateRole,
  validations,
  asyncHandler(checkRole),
  asyncHandler(roles.updateRole)
);

export default router;
