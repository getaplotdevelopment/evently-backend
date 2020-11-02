export default async (model, include, condition) => {
  const { rows: data } = await model.findAndCountAll({
    where: condition,
    include
  });
  return data;
};
