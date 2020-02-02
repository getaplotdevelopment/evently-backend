import jwt from 'jsonwebtoken';
import 'dotenv/config';
import httpError from '../../helpers/errorsHandler/httpError';

const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    throw new httpError(401, 'Access denied, provide a token');
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

export default isAuthenticated;
