module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      is_read: DataTypes.BOOLEAN,
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      to: DataTypes.STRING,
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
