import express from 'express';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import http from 'http';
import cors from 'cors';
import path from 'path';
import socket from './services/socket/socket.io';
import sockets from './services/socket';
import routes from './routes';
import 'dotenv/config';

const swaggerDocument = require(path.resolve('./src/config', 'swagger.json'));

const app = express();
const server = http.createServer(app);
const io = sockets(server);

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public/notifications'));

app.use((req, _, next) => {
  req.io = io;
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);
app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: 'Page not found'
  });
});

socket.socketFunction.socketStarter(server);

export { app, server };
