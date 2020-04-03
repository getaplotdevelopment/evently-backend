import httpError from './errorsHandler/httpError';
import models from '../models/index';

const { User, Roles } = models;

export default async (email, id) => {
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Roles,
        as: 'roles'
      }
    ]
  });

  const { dataValues } = user;
  const { roles } = dataValues;
  if (dataValues.id !== id) {
    if (roles.designation !== 'SUPER USER') {
      throw new httpError(
        403,
        "Un-authorized, User role can't perform this action."
      );
    }
  } else if (dataValues.id === id) {
    if (roles.designation === 'SUPER USER') {
      throw new httpError(
        403,
        "Un-authorized, User role can't perform this action."
      );
    }
  }
  return user;
};
