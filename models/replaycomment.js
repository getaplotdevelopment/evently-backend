module.exports = (sequelize, DataTypes) => {
  const replayComment = sequelize.define(
    'replayComment',
    {
      text: DataTypes.STRING,
      img: DataTypes.STRING,
      commentEvent: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
      ishidden: { type: DataTypes.BOOLEAN, defaultValue: false },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  replayComment.associate = models => {
    replayComment.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    replayComment.belongsTo(models.commentEvent, {
      as: 'commentEvents',
      foreignKey: 'commentEvent',
      onDelete: 'CASCADE'
    });
  };
  return replayComment;
};
