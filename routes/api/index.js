import { Router } from 'express';
import events from './event';
import users from './users';
import organizerProfile from './profile';
import socialAuth from './socialAuth';
import roles from './roles';
import ticketCategory from './ticketCategory';
import ticket from './ticket';
import feedback from './feedback';
import commentEvent from './commentEvent';
import experience from './experience';
import push from './push';

const router = Router();

router.use('/', events);
router.use('/users', [users, socialAuth]);
router.use('/profile', organizerProfile);
router.use('/roles', roles);
router.use('/ticket/category', ticketCategory);
router.use('/ticket', ticket);
router.use('/feedback', feedback);
router.use('/event', commentEvent);
router.use('/experience', experience);
router.use('/push', push);
export default router;