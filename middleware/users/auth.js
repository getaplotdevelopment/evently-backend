import models from '../../models/index';
import authHelper from '../../helpers/authHelper';

const { User } = models;

export default async (req, res, next) => {
  const email = await authHelper(req);
  const anyUser = await User.findOne({ where: { email } });
  if (!anyUser) {
    return res.status(401).json({
      status: 401,
      message: 'You are not connected'
    });
  }
  req.user = anyUser.dataValues;
  next();
};
