import HttpError from './errorsHandler/httpError';
import models from '../models/index';

const { Feedback, User } = models;
export default async (model, id) => {
  let item;
  if (model === Feedback) {
    item = 'Feedback';
  } else if (model === User) {
    item = 'User';
  }
  const data = await model.findOne({ where: { id } });
  if (!data) {
    throw new HttpError(404, `${item} not found`);
  }
  return data;
};
