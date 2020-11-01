"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (model, condition) => {
  const foundInstance = await model.findOne({
    where: condition
  });
  return foundInstance;
};