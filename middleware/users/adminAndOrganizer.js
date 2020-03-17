import { Op } from 'sequelize';
import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';
import authHelper from '../../helpers/authHelper';

const { User, Role } = models;

export default async (req, res, next) => {
  const email = await authHelper(req);
  const superUser = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        where: {
          [Op.or]: [{ designation: 'ORGANIZER' }, { designation: 'SUPER USER' }]
        }
      }
    ]
  });
  if (!superUser) {
    throw new httpError(
      403,
      "Un-authorized, User role can't perform this action."
    );
  }
  const { dataValues } = superUser;
  req.user = dataValues;
  next();
};
