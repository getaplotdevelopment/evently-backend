import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/adminOrgStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = { email };
  const condition2 = [
    { designation: 'SUPER USER' },
    { designation: 'ORGANIZER' }
  ];
  const superUser = await authStrategy(condition, condition2);
  const { dataValues } = superUser;
  req.user = dataValues;
  next();
};
