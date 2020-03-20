import { Op } from 'sequelize';
import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';
import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition = [{ designation: 'ORGANIZER' }, { designation: 'USER' }];
  const user = authStrategy(condition, email);
  //   const superUser = await User.findOne({
  //     where: { email },
  //     include: [
  //       {
  //         model: Roles,
  //         as: 'roles',
  //         where: {
  //           [Op.or]: [{ designation: 'ORGANIZER' }, { designation: 'USER' }]
  //         }
  //       }
  //     ]
  //   });
  //   if (!superUser) {
  //     throw new httpError(
  //       403,
  //       "Un-authorized, User role can't perform this action."
  //     );
  //   }
  //   const { dataValues } = superUser;
  //   req.user = dataValues;
  console.log('user', user);
  const { dataValues } = user;
  req.user = dataValues;
  next();
};
