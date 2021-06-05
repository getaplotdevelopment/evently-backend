module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      is_read: DataTypes.BOOLEAN,
      content: DataTypes.STRING,
      receiverId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Notification'
    }
  );
  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      as: 'receiver',
      foreignKey: 'receiverId'
    });
  };
  return Notification;
};
