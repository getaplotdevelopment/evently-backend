import express from 'express';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import isAdmin from '../../middleware/users/isAdminAuth';
import Report from '../../controllers/report';
import checkToken from '../../middleware/users/checkToken';

const report = new Report();

const router = express.Router();

router.get(
  '/',
  asyncHandler(checkToken),
  asyncHandler(isAdmin),
  asyncHandler(report.getAllReport)
);

export default router;
