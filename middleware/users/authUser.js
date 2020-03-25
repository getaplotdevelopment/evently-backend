import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition2 = { email, isApproved: true };
  const condition = { designation: 'ORGANIZER' };
  const organizer = await authStrategy(condition, condition2);
  console.log('organizer', organizer);
  const { dataValues } = organizer;
  req.organizer = dataValues;
  next();
};
