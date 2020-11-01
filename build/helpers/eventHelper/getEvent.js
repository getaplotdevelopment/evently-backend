"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (searchParams, filterBy, model, include) => {
  const limit = searchParams.limit || 25;
  const currentPage = searchParams.page || 1;
  const offset = limit * currentPage - limit;
  const order = searchParams.sort ? [] : [['createdAt', 'DESC']];

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
  delete searchParams.limit;
  const {
    rows: data
  } = await model.findAndCountAll({
    where: filterBy,
    limit,
    offset,
    order,
    include
  });
  const countAll = await model.count();
  const pages = Math.ceil(countAll / limit);
  const count = data.length;
  return {
    pages,
    count,
    data
  };
};