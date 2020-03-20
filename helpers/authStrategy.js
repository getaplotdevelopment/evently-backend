import { Op } from 'sequelize';
import httpError from './errorsHandler/httpError';
import models from '../models/index';

const { User, Roles } = models;

export default async (condition, email) => {
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Roles,
        as: 'roles',
        where: {
          [Op.or]: condition
        }
      }
    ]
  });

  if (!user) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  return user;
};
