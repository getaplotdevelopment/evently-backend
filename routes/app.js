import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import users from './api/users';
import socialAuth from './api/socialAuth';
import events from '../routes/api/event';

const app = express();

app.use('/api', events);
app.use('/api/users', [users, socialAuth]);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
