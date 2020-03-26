'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    follower: DataTypes.STRING,
    following: DataTypes.STRING
  }, {});
  Follow.associate = function(models) {
    // associations can be defined here
    Follow.belongsTo(models.User, {
      as: 'followKey',
      foreignKey: 'follower',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};