import express from 'express';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import http from 'http';
import cors from 'cors';
import createError from 'http-errors';
import swaggerDocument from './config/swagger.json';
import { HTTP_NOT_FOUND } from './constants/httpStatusCode';
import sockets from './services/socket';
import routes from './routes';

const app = express();
const server = http.createServer(app);
const io = sockets(server);

app.use(cors());
app.use(passport.initialize());
app.use(express.json({ extended: false }));

app.use((req, _, next) => {
  req.io = io;
  next();
});

app.use((req, res, next) => {
  next(createError(HTTP_NOT_FOUND, 'resource not found'));
});

app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app, server };
