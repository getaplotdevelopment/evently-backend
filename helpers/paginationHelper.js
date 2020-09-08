export default async (searchParams, model, attributes, include) => {
  const limit = 10;
  const currentPage = (searchParams && searchParams.page) || 1;
  const offset = limit * currentPage - limit;

  const { count: countAll, rows: data } = await model.findAndCountAll({
    attributes,
    include,
    limit,
    offset
  });

  const pages = Math.ceil(countAll / limit);
  const count = data.length;
  return { pages, count, data };
};
