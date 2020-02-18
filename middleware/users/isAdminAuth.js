import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';
import authHelper from '../../helpers/authHelper';

const { User } = models;

export default async (req, res, next) => {
  const email = await authHelper(req);
  const superUser = await User.findOne({ where: { email, role: 3 } });
  if (!superUser) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  const { dataValues } = superUser;
  req.superUser = dataValues;
  next();
};
