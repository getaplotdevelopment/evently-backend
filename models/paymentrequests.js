'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentRequests = sequelize.define('PaymentRequests', {
    verificationId: DataTypes.STRING,
    refId: DataTypes.STRING,
    status: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    eventStatus: DataTypes.STRING,
    customer: DataTypes.JSON,
    paymentType: DataTypes.STRING
  }, {});
  PaymentRequests.associate = function(models) {
    // associations can be defined here
    PaymentRequests.hasMany(models.PaymentEvents, {
      foreignKey: 'refID',
      allowNull: false
    });
  };
  return PaymentRequests;
};
