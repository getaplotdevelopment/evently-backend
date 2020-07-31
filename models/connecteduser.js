module.exports = (sequelize, DataTypes) => {
  const ConnectedUser = sequelize.define('ConnectedUser', {
    user: DataTypes.INTEGER,
    clientId: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('online', 'offline', 'away', 'not disturb'),
      allowNull: false,
      defaultValue: 'online'
    }
  });
  ConnectedUser.associate = models => {
    ConnectedUser.belongsTo(models.User, {
      as: 'userfk',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    ConnectedUser.hasMany(models.Forum, {
      foreignKey: 'connectedUser',
      allowNull: false
    });
  };
  return ConnectedUser;
};