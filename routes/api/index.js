import { Router } from 'express';
import events from './event';
import users from './users';
import organizerProfile from './profile';
import socialAuth from './socialAuth';
import roles from './roles';
import ticketCategory from './ticketCategory';
import ticket from './ticket';
import feedback from './feedback';

const router = Router();

router.use('/api', events);
router.use('/api/users', [users, socialAuth]);
router.use('/api/profile', organizerProfile);
router.use('/api/roles', roles);
router.use('/api/ticket/category', ticketCategory);
router.use('/api/ticket', ticket);
router.use('/api/feedback', feedback);

export default router;
