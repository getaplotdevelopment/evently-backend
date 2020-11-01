"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (model, condition) => {
  const instance = await model.findOne({
    where: condition
  });

  if (instance) {
    model.destroy({
      where: condition
    });
  }

  return instance;
};