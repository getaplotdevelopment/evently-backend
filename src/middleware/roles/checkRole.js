import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { Roles } = models;

const checkRole = async (req, res, next) => {
  const { roleId } = req.params;
  const role = await Roles.findOne({
    where: { id: roleId }
  });

  if (!role) {
    throw new httpError(404, 'Role does not exist');
  }
  next();
};
const checkRoleDesignation = async (req, res, next) => {
  const { designation } = req.body;
  const role = await Roles.findOne({ where: { designation } });
  if (role) {
    throw new httpError(400, 'Role already exist');
  }
  next();
};

export { checkRole, checkRoleDesignation };
