"use strict";

module.exports = (sequelize, DataTypes) => {
  const LikeCommentExperience = sequelize.define('LikeCommentExperience', {
    hasLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hasDisliked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    commentExperience: DataTypes.INTEGER,
    user: DataTypes.INTEGER
  }, {});

  LikeCommentExperience.associate = models => {
    LikeCommentExperience.belongsTo(models.CommentExperience, {
      as: 'comments',
      foreignKey: 'commentExperience',
      onDelete: 'CASCADE'
    });
    LikeCommentExperience.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };

  return LikeCommentExperience;
};