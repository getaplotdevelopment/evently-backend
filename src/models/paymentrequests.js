'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentRequests = sequelize.define(
    'PaymentRequests',
    {
      verificationId: DataTypes.STRING,
      refId: DataTypes.STRING,
      status: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      eventStatus: DataTypes.STRING,
      customer: DataTypes.JSON,
      paymentType: DataTypes.STRING,
      ticketIds: DataTypes.ARRAY(DataTypes.INTEGER),
      user: DataTypes.INTEGER,
      expireBy: DataTypes.DATE,
      organizer: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      event: {
        type: DataTypes.STRING,
        references: { model: 'Event', key: 'slug' }
      },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  PaymentRequests.associate = function(models) {
    // associations can be defined here
    PaymentRequests.hasMany(models.PaymentEvents, {
      foreignKey: 'refID',
      allowNull: false
    });
    PaymentRequests.hasMany(models.PaymentRefunds, {
      foreignKey: 'refID',
      allowNull: false
    });
    PaymentRequests.belongsTo(models.User, {
      as: 'eventOrganizer',
      foreignKey: 'organizer',
      onDelete: 'CASCADE'
    });
    PaymentRequests.belongsTo(models.Event, {
      as: 'events',
      foreignKey: 'event',
      onDelete: 'CASCADE'
    });
  };
  return PaymentRequests;
};
