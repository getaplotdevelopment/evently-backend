import express from 'express';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import http from 'http';
import cors from 'cors';
import path from 'path';
import swaggerDocument from './config/swagger.json';
import sockets from './services/socket';
import routes from './routes';
import 'dotenv/config';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: 'Page not found'
  });
});

export { app, server };
