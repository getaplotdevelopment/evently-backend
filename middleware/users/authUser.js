import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';
import authHelper from '../../helpers/authHelper';

const { User, Roles } = models;

export default async (req, res, next) => {
  const email = await authHelper(req);
  const organizer = await User.findOne({
    where: { email },
    include: [
      { model: Roles, as: 'roles', where: { designation: 'ORGANIZER' } }
    ]
  });
  if (!organizer) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  const { dataValues } = organizer;
  req.organizer = dataValues;
  next();
};
