module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      price: DataTypes.INTEGER,
      ticketNumber: DataTypes.INTEGER,
      status: DataTypes.STRING,
      category: {
        type: DataTypes.INTEGER,
        references: { model: 'TicketCategory', key: 'id' }
      },
      organizer: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      event: {
        type: DataTypes.STRING,
        references: { model: 'Event', key: 'slug' }
      }
    },
    {}
  );
  Ticket.associate = function(models) {
    Ticket.belongsTo(models.TicketCategory, {
      as: 'ticketCategory',
      foreignKey: 'category',
      onDelete: 'CASCADE'
    });
    Ticket.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'organizer',
      onDelete: 'CASCADE'
    });
    Ticket.belongsTo(models.Event, {
      as: 'events',
      foreignKey: 'event',
      onDelete: 'CASCADE'
    });
    Ticket.hasMany(models.PaymentEvents, {
      foreignKey: 'ticketNo',
      allowNull: false
    });
  };
  return Ticket;
};
