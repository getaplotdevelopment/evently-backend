module.exports = (sequelize, DataTypes) => {
  const ReplayExperienceComment = sequelize.define(
    'ReplayExperienceComment',
    {
      text: DataTypes.TEXT,
      img: DataTypes.STRING,
      user: DataTypes.INTEGER,
      experienceComment: DataTypes.INTEGER,
      isDeleted: DataTypes.BOOLEAN
    },
    {}
  );
  ReplayExperienceComment.associate = models => {
    ReplayExperienceComment.belongsTo(models.CommentExperience, {
      as: 'comment',
      foreignKey: 'experienceComment',
      onDelete: 'CASCADE'
    });
    ReplayExperienceComment.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };
  return ReplayExperienceComment;
};
