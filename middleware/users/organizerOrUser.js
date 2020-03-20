import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = [{ designation: 'ORGANIZER' }, { designation: 'USER' }];
  const user = await authStrategy(condition, email);

  const { dataValues } = user;
  req.user = dataValues;
  next();
};
