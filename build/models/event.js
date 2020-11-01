"use strict";

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    tagList: DataTypes.ARRAY('STRING'),
    category: DataTypes.STRING,
    location: DataTypes.JSON,
    numberDays: DataTypes.STRING,
    startTime: DataTypes.STRING,
    startDate: DataTypes.DATE,
    finishDate: DataTypes.DATE,
    eventType: DataTypes.BOOLEAN,
    favorited: DataTypes.BOOLEAN,
    favoritedCount: DataTypes.INTEGER,
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    eventImage: DataTypes.STRING,
    currentMode: DataTypes.STRING,
    organizer: DataTypes.JSON,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    isLiked: DataTypes.BOOLEAN,
    popularityCount: DataTypes.INTEGER,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    popularityCount: DataTypes.INTEGER
  }, {});

  Event.associate = function (models) {
    // associations can be defined here
    Event.belongsTo(models.User, {
      as: 'userfkey',
      foreignKey: 'slug',
      onDelete: 'CASCADE'
    });
    Event.hasMany(models.Likes, {
      foreignKey: 'slug'
    });
    Event.hasMany(models.Ticket, {
      foreignKey: 'event',
      allowNull: false
    });
    Event.hasMany(models.PaymentEvents, {
      foreignKey: 'event',
      allowNull: false
    });
    Event.hasMany(models.commentEvent, {
      foreignKey: 'event',
      allowNull: false
    });
    Event.hasMany(models.PaymentRefunds, {
      foreignKey: 'event',
      allowNull: false
    });
    Event.hasMany(models.PaymentRequests, {
      foreignKey: 'event',
      allowNull: false
    });
    Event.hasMany(models.FeaturedEvents, {
      foreignKey: 'eventSlug'
    });
  };

  return Event;
};