"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Event,
  Likes
} = _models2.default;

exports.default = async (user, slug) => {
  let data;
  const likeObj = {
    slug,
    user
  };
  const likeValues = await Likes.findOne({
    where: likeObj
  });

  if (likeValues) {
    const {
      isLiked
    } = likeValues;
    const row = await Likes.update({
      isLiked: !isLiked
    }, {
      where: likeObj,
      returning: true
    });
    data = row[1][0];
  } else {
    data = await Likes.create(likeObj);
    Event.increment({
      popularityCount: 2
    }, {
      where: {
        slug
      }
    });
  }

  const likedBy = await Likes.findAll({
    where: {
      slug,
      isLiked: true
    }
  });
  const isLiked = likedBy.length !== 0;
  await Event.update({
    isLiked
  }, {
    where: {
      slug
    }
  });
  return {
    data,
    likedBy,
    isLiked
  };
};