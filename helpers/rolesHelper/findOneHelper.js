export default async (model, condition) => {
  const foundInstance = await model.findOne({
    where: condition
  });
  return foundInstance;
};
