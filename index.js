import { app, server } from './app';

/**
 * Normalize the post number
 * @param {int} val port number
 * @returns {int} the port number
 */
const normalizePort = val => {
  const port = Number(val);
  if (Number.isNaN(val)) {
    return val;
  }
  return port >= 0 ? port : false;
};

const port = normalizePort(process.env.PORT || 5000);
app.set('port', port);

/**
 * catching errors
 */

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      process.stdout.write(`${bind} requries elevated privles\n`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.stdout.write(`${bind} is already in use\n`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/**
 * Event listner for HTTP server
 * @returns {void}
 */
const onListing = () => {
  let bind = '';
  const addr = server.address();
  if (typeof addr === 'string') {
    bind = `pipe ${addr.port}`;
  } else if (addr && typeof addr === 'object' && addr.port) {
    bind = `port ${addr.port}`;
  }
  if (process.env.APP_URL) {
    return process.stdout.write(
      `Server is running at :${process.env.APP_URL}\n`
    );
  }
  return process.stdout.write(`Server is running on port: ${port}\n`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListing);

export default app;
