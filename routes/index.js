import { Router } from 'express';
import webpush from 'web-push';
import api from './api';

const router = Router();

router.use('/api', api);

// Get home page

router.get('/', (_, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Welcome to get a plot'
  });
});

export default router;
