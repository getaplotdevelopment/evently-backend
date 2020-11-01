"use strict";

module.exports = (sequelize, DataTypes) => {
  const LikeExperience = sequelize.define('LikeExperience', {
    hasLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    hasDisliked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    experience: DataTypes.INTEGER,
    user: DataTypes.INTEGER
  }, {});

  LikeExperience.associate = models => {
    LikeExperience.belongsTo(models.Experience, {
      as: 'experiences',
      foreignKey: 'experience',
      onDelte: 'CASCADE'
    });
    LikeExperience.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };

  return LikeExperience;
};