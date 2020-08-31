import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition2 = { email /* isApproved: true */ };
  const condition = { role: 'ORGANIZER' };
  const organizer = await authStrategy(condition, condition2);
  const { dataValues } = organizer;
  req.organizer = dataValues;
  next();
};
