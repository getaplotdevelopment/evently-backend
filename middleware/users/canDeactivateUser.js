import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const { id } = req.body;
  const email = await authHelper(req);
  const condition = [
    { designation: 'USER' },
    { designation: 'SUPER USER' },
    { designation: 'ORGANIZER' }
  ];
  const superUser = await authStrategy(condition, email, id);
  req.user = superUser.dataValues;
  next();
};
