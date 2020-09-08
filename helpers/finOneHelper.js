export default async (model, condition, include) => {
  const instance = await model.findOne({ where: condition, include });
  return instance;
};
