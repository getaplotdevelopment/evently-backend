"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (model, condition, include) => {
  const instance = await model.findOne({
    where: condition,
    include
  });
  return instance;
};