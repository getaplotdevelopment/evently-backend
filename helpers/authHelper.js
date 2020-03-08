import jwt from 'jsonwebtoken';
import 'dotenv/config';
import httpError from './errorsHandler/httpError';
import { redisClient } from './logout/redisClient';

export default async req => {
  const token = req.header('Authorization');

  if (!token) {
    throw new httpError(401, 'Token is required');
  }
  // const redisToken = token.split(' ')[1];
  // const result = await redisClient.lrange('redisToken', 0, 99999999);
  // if (result.indexOf(redisToken) > -1) {
  //   throw new httpError(400, 'Invalid token');
  // }
  const { email } = jwt.verify(token.split(' ')[1], process.env.jwtSecret);
  console.log('email', email);
  return email;
};
