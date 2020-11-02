import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/adminOrgStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = { email };
  const condition2 = [{ role: 'ORGANIZER' }, { role: 'USER' }];
  const user = await authStrategy(condition, condition2);

  const { dataValues } = user;
  req.user = dataValues;
  next();
};
