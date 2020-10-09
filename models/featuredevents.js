module.exports = (sequelize, DataTypes) => {
  const FeaturedEvents = sequelize.define(
    'FeaturedEvents',
    {
      eventSlug: {
        type: DataTypes.STRING,
        references: { model: 'Event', key: 'slug' }
      },
      eventName: DataTypes.STRING,
      startDate: DataTypes.DATE,
      finishDate: DataTypes.DATE,
      amount: {
        type: DataTypes.INTEGER,
        references: { model: 'PaymentEvents', key: 'amount' }
      },
      featuredStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      featuredDays: DataTypes.INTEGER,
      verificationId: DataTypes.STRING,
      refId: DataTypes.STRING
    },
    {}
  );
  FeaturedEvents.associate = function(models) {
    // associations can be defined here
    FeaturedEvents.belongsTo(models.Event, {
      as: 'event',
      foreignKey: 'eventSlug',
      onDelete: 'CASCADE'
    });
    FeaturedEvents.belongsTo(models.PaymentEvents, {
      as: 'eventPrice',
      foreignKey: 'amount',
      allowNull: false
    });
  };
  return FeaturedEvents;
};
