import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth';
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
  auth,
  validateRole,
  validations,
  asyncHandler(checkRoleDesignation),
  asyncHandler(roles.createRole)
);
router.get('/', asyncHandler(auth), asyncHandler(roles.getAllRoles));
router.get(
  '/:roleId',
  asyncHandler(auth),
  asyncHandler(checkRole),
  asyncHandler(roles.getOneRole)
);
router.put(
  '/:roleId',
  asyncHandler(auth),
  validateRole,
  validations,
  asyncHandler(checkRole),
  asyncHandler(roles.updateRole)
);

export default router;
