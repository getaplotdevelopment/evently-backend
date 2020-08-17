module.exports = (sequelize, DataTypes) => {
  const LikeCommentExperience = sequelize.define(
    'LikeCommentExperience',
    {
      asLiked: DataTypes.BOOLEAN,
      commentExperience: DataTypes.INTEGER,
      user: DataTypes.INTEGER
    },
    {}
  );
  LikeCommentExperience.associate = models => {
    LikeCommentExperience.belongsTo(models.CommentExperience, {
      as: 'comments',
      foreignKey: 'commentExperience',
      onDelete: 'CASCADE'
    });
    LikeCommentExperience.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };
  return LikeCommentExperience;
};
