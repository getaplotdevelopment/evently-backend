import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/adminOrgStrategy';
import shouldDeactivateUser from '../../helpers/shouldDeactivateUser';

export default async (req, res, next) => {
  const { id } = req.body;
  const email = await authHelper(req);
  const condition = { email };
  const condition2 = [
    { role: 'USER' },
    { role: 'SUPER USER' },
    { role: 'ORGANIZER' }
  ];
  const superUser = await authStrategy(condition, condition2);
  await shouldDeactivateUser(email, id);
  req.user = superUser.dataValues;
  next();
};
