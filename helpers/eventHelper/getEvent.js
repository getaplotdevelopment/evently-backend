import models from '../../models';
const { Event, Likes } = models;

export default async (searchParams, filterBy, model) => {
  const limit = 25;
  const currentPage = searchParams.page || 1;
  const offset = limit * currentPage - limit;
  const order = [];

  if (searchParams.sort) {
    const sort = searchParams.sort.split(',');
    sort.forEach(item => {
      const splitSort = item.split(':');
      splitSort[1] = splitSort[1].toUpperCase();
      order.push(splitSort);
    });
  }

  delete searchParams.page;
  delete searchParams.sort;

  const { count: countAll, rows: data } = await model.findAndCountAll({
    where: filterBy,
    limit,
    offset,
    order
  });
  const pages = Math.ceil(countAll / limit);
  const count = data.length;
  return { pages, count, data };
};
