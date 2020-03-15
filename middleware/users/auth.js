import models from '../../models/index';
import authHelper from '../../helpers/authHelper';

const { User } = models;

export default async (req, res, next) => {
  const email = await authHelper(req);
  const anyUser = await User.findOne({ where: { email } });

  req.user = anyUser.dataValues;
  next();
};
