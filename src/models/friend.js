module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    'Friend',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
      },
      sentTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
      },
      sentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
      },
      requestStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
      },
      isFriend: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      receivedStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {}
  );
  Friend.associate = function(models) {
    Friend.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'from',
      onDelete: 'CASCADE'
    });
    Friend.belongsTo(models.User, {
      as: 'receiver',
      foreignKey: 'sentTo',
      onDelete: 'CASCADE'
    });
  };
  return Friend;
};
