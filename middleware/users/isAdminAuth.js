import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = { designation: 'SUPER USER' };
  const superUser = await authStrategy(condition, email);
  const { dataValues } = superUser;
  req.superUser = dataValues;
  next();
};
