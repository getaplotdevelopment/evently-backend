module.exports = (sequelize, DataTypes) => {
  const shareComment = sequelize.define(
    'shareComment',
    {
      comment: DataTypes.INTEGER,
      users: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    {}
  );
  shareComment.associate = models => {
    shareComment.belongsTo(models.commentEvent, {
      as: 'commentEvents',
      foreignKey: 'comment'
    });
    shareComment.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'users'
    });
  };
  return shareComment;
};
