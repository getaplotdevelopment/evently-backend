module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define(
    'Story',
    {
      caption: DataTypes.STRING,
      picture: DataTypes.STRING,
      ownerId: DataTypes.INTEGER,
      allowedFriends: { type: DataTypes.ARRAY(DataTypes.INTEGER) }
    },
    {
      sequelize,
      modelName: 'Story'
    }
  );
  Story.associate = function(models) {
    Story.belongsTo(models.User, {
      as: 'storyOwner',
      foreignKey: 'ownerId'
    });
  };
  return Story;
};
