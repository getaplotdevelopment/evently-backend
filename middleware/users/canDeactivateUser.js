import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = [
    { designation: 'USER' },
    { designation: 'SUPER USER' },
    { designation: 'ORGANIZER' }
  ];
  const superUser = await authStrategy(condition, email);
  req.user = superUser.dataValues;
  next();
};
