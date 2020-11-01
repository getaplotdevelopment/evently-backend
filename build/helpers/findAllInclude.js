"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (model, include, condition) => {
  const {
    rows: data
  } = await model.findAndCountAll({
    where: condition,
    include
  });
  return data;
};