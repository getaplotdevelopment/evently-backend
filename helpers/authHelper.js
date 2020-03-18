import jwt from 'jsonwebtoken';
import 'dotenv/config';
import httpError from './errorsHandler/httpError';

export default async req => {
  const token = req.header('Authorization');

  if (!token) {
    throw new httpError(401, 'Token is required');
  }
  const { email } = jwt.verify(token.split(' ')[1], process.env.jwtSecret);
  return email;
};
