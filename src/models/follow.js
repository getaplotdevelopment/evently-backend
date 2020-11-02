'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      follower: DataTypes.STRING,
      following: DataTypes.STRING,
      isFollowing: DataTypes.BOOLEAN
    },
    {}
  );
  Follow.associate = function(models) {
    Follow.belongsTo(models.User, {
      as: 'followedUser',
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
