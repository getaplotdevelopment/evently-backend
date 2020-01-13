import express from 'express';
import {createEventController} from '../../controller/event'

const router = express.Router();

router.post(
  '/event',
  createEventController
);

export default router;