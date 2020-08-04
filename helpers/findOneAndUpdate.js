export default async (model, condition) => {
  const instance = await model.findOne({ where: condition });
  if (instance) {
    model.update({ where: condition });
  }
  return instance;
};
