module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define('Forum', {
    clientId: DataTypes.STRING,
    connectedUser: DataTypes.INTEGER
  });
  Forum.associate = models => {
    Forum.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'connectedUser',
      onDelete: 'CASCADE'
    });
  };
  return Forum;
};
