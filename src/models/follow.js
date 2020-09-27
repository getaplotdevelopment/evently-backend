'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      follower: DataTypes.STRING,
      following: DataTypes.STRING,
      isFollowing: DataTypes.BOOLEAN,
      followerObj: DataTypes.JSON,
      followingObj: DataTypes.JSON
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
