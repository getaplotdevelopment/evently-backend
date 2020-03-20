import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = { designation: 'ORGANIZER' };
  const organizer = await authStrategy(condition, email);
  const { dataValues } = organizer;
  req.organizer = dataValues;
  next();
};
