import models from '../../models';
const { Event } = models;

export default async (searchParams, filterBy) => {
  const limit = 25;
  const currentPage = searchParams.page || 1;
  const offset = limit * currentPage - limit;

  delete searchParams.page;
  const { count: countAll, rows: data } = await Event.findAndCountAll({
    where: filterBy,
    limit,
    offset
  });
  const pages = Math.ceil(countAll / limit);
  const count = data.length;
  return { pages, count, data };
};
