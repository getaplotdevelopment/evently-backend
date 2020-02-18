module.exports = (sequelize, DataTypes) => {
  const TicketCategory = sequelize.define(
    'TicketCategory',
    {
      designation: DataTypes.STRING
    },
    {}
  );
  TicketCategory.associate = function(models) {
    TicketCategory.hasMany(models.Ticket, {
      foreignKey: 'category',
      allowNull: false
    });
  };
  return TicketCategory;
};
