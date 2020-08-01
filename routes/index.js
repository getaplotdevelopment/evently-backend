import { Router } from 'express';
import api from './api';

const router = Router();

router.use('/api', api);

// Get hope page

router.get('/', (_, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to get a plot'
  });
});

export default router;
