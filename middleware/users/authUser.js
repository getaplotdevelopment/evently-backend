import jwt from 'jsonwebtoken';
import 'dotenv/config';
import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';
import authHelper from '../../helpers/authHelper'

const { User } = models;

export default async (req, res, next) => {
  const email = await authHelper(req)
  const organizer = await User.findOne({ where: { email, isOrganizer: true } });
  if (!organizer) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  const { dataValues } = organizer;
  req.organizer = dataValues;
  next();
};
