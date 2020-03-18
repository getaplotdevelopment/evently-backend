/* eslint-disable no-nested-ternary */
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { redisClient } from '../../helpers/logout/redisClient';
import HttpError from '../../helpers/errorsHandler/httpError';

const checkToken = async (req, res, next) => {
  const token = req.body.token
    ? req.body.token
    : req.query.token
    ? req.query.token
    : req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.jwtSecret, (err, res) => {
    if (err) {
      throw new HttpError(403, err);
    }
  });

  const invalid = callback => {
    redisClient.lrange('token', 0, 999999999, (err, result) =>
      callback(result)
    );
  };
  invalid(result => {
    if (result.indexOf(token) > -1) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid token'
      });
    }
    next();
  });
};

export default checkToken;
