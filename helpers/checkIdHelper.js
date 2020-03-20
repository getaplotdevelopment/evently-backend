import HttpError from './errorsHandler/httpError';

export default async (model, id) => {
  const data = await model.findOne({ where: { id } });
  if (!data) {
    throw new HttpError(404, 'Item not found');
  }
  return data;
};
