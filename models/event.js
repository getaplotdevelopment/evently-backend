'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    slug: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.STRING,
    tagList: DataTypes.ARRAY("STRING"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    favorited: DataTypes.BOOLEAN,
    favoritedCount: DataTypes.INTEGER
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};