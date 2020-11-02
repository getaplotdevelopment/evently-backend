'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define(
    'Likes',
    {
      user: {
        type: DataTypes.INTEGER
      },
      slug: {
        type: DataTypes.STRING,
        defaultValue: false
      },
      isLiked: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  Likes.associate = function(models) {
    // associations can be defined here
    Likes.belongsTo(models.User, {
      as: 'likedBy',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    Likes.belongsTo(models.Event, {
      as: 'eventKey',
      foreignKey: 'slug',
      onDelete: 'CASCADE'
    });
  };
  return Likes;
};
