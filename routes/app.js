import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import users from './api/users';
import socialAuth from './api/socialAuth';
import events from './api/event';
import organizerProfile from './api/profile';

const app = express();

app.use('/api', events);
app.use('/api/users', [users, socialAuth]);
app.use('/api/profile', organizerProfile);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
