import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import users from './api/users';
import socialAuth from './api/socialAuth';
import events from './api/event';
import payments from './api/payments';
import organizerProfile from './api/profile';
import roles from './api/roles';
import ticketCategory from './api/ticketCategory';
import ticket from './api/ticket';
import feedback from './api/feedback';
import featuredEvent from './api/featuredEvent';

const app = express();

app.use('/api', featuredEvent);
app.use('/api', events);
app.use('/api/payments', payments);
app.use('/api/users', [users, socialAuth]);
app.use('/api/profile', organizerProfile);
app.use('/api/roles', roles);
app.use('/api/ticket/category', ticketCategory);
app.use('/api/ticket', ticket);
app.use('/api/feedback', feedback);
app.use('/api/stories', feedback);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/redirect', (req, res) => {
  res.sendfile('views/index.html');
});

export default app;
