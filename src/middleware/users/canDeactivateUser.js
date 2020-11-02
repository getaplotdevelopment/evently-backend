import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';
import shouldDeactivateUser from '../../helpers/shouldDeactivateUser';

export default async (req, res, next) => {
  const { id } = req.body;
  const email = await authHelper(req);
  const condition = { email, role: 'SUPER USER' };
  const condition2 = { email };
  const superUser = await authStrategy(condition, condition2);
  await shouldDeactivateUser(email, id);
  req.user = superUser.dataValues;
  next();
};
