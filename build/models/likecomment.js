"use strict";

module.exports = (sequelize, DataTypes) => {
  const likeComment = sequelize.define('likeComment', {
    commentEvent: DataTypes.INTEGER,
    user: DataTypes.INTEGER,
    hasLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hasDisliked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  likeComment.associate = models => {
    likeComment.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    likeComment.belongsTo(models.commentEvent, {
      as: 'commentEvents',
      foreignKey: 'commentEvent',
      onDelete: 'CASCADE'
    });
  };

  return likeComment;
};