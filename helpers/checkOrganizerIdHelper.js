import HttpError from './errorsHandler/httpError';
import models from '../models/index';

const { Roles } = models;
export default async (model, id) => {
  const data = await model.findOne({
    where: { id },
    include: [
      { model: Roles, as: 'roles', where: { designation: 'ORGANIZER' } }
    ]
  });
  if (!data) {
    throw new HttpError(400, 'Only organizers can be approved');
  }
  return data;
};
