export default async (model, condition) => {
  const role = await model.findOne({ where: condition });
  return role;
};
