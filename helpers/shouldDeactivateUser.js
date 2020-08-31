import httpError from './errorsHandler/httpError';
import models from '../models/index';

const { User } = models;

export default async (email, id) => {
  const user = await User.findOne({
    where: { email, role: 'SUPER USER' }
  });

  const { dataValues } = user;
  if (!user) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  if (dataValues.id === id) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  return user;
};
