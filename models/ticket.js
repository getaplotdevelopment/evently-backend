module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      price: DataTypes.INTEGER,
      number: DataTypes.INTEGER,
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
  };
  return Ticket;
};
