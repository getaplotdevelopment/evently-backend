"use strict";

module.exports = (sequelize, DataTypes) => {
  const OrganizerProfile = sequelize.define('OrganizerProfile', {
    accountName: DataTypes.STRING,
    description: DataTypes.STRING,
    domain: DataTypes.STRING,
    location: DataTypes.JSON,
    profilePhoto: DataTypes.STRING,
    coverPhoto: DataTypes.STRING,
    preferences: DataTypes.ARRAY('STRING'),
    lastLogin: DataTypes.DATE,
    accountType: DataTypes.STRING,
    social: {
      type: DataTypes.JSON,
      allowNull: true
    },
    organizer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {});

  OrganizerProfile.associate = function (models) {
    OrganizerProfile.belongsTo(models.User, {
      as: 'userfkey',
      foreignKey: 'organizer',
      onDelete: 'CASCADE'
    });
  };

  return OrganizerProfile;
};