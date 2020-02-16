'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    email:  {
      type: DataTypes.STRING,
      references: { model: 'User', key: 'email' }
    },
    slug: {
      type: DataTypes.STRING,
      defaultValue: false
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Likes.associate = function(models) {
    // associations can be defined here
    Likes.belongsTo(models.User, {
      as: 'likedByKey',
      foreignKey: 'email',
      onDelete: 'CASCADE'
    })
    Likes.belongsTo(models.Event, {
      as: 'eventKey',
      foreignKey: 'slug',
      onDelete: 'CASCADE'
    })
  };
  return Likes;
};