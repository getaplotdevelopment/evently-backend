"use strict";

module.exports = (sequelize, DataTypes) => {
  const commentEvent = sequelize.define('commentEvent', {
    text: DataTypes.STRING,
    img: DataTypes.STRING,
    user: DataTypes.INTEGER,
    event: DataTypes.STRING,
    ishidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  commentEvent.associate = models => {
    commentEvent.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    commentEvent.belongsTo(models.Event, {
      as: 'events',
      foreignKey: 'event',
      onDelete: 'CASCADE'
    });
    commentEvent.hasMany(models.likeComment, {
      foreignKey: 'commentEvent',
      allowNull: false
    });
    commentEvent.hasMany(models.replayComment, {
      foreignKey: 'commentEvent',
      allowNull: false
    });
    commentEvent.hasMany(models.shareComment, {
      foreignKey: 'commentEvent',
      allowNull: false
    });
  };

  return commentEvent;
};