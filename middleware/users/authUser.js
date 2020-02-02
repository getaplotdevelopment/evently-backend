import jwt from 'jsonwebtoken';
import 'dotenv/config';
import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';

const { User } = models;

export default async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    throw new httpError(401, 'Token is required');
  }
  const { email } = jwt.verify(token.split(' ')[1], process.env.jwtSecret);
  const user = await User.findOne({ where: { email, isOrganizer: true } });
  if (!user) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  const { dataValues } = user;
  req.organizer = dataValues;
  next();
};
