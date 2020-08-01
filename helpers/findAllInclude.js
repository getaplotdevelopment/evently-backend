export default async (model, include) => {
  const { rows: data } = await model.findAndCountAll({
    include
  });
  return data;
};
