import { Op } from 'sequelize';
import httpError from './errorsHandler/httpError';
import models from '../models/index';

const { User, Roles } = models;

export default async (condition, condition2) => {
  const user = await User.findOne({
    where: condition2,
    [Op.or]: condition
  });

  if (!user) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  return user;
};
