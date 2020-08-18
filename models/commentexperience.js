module.exports = (sequelize, DataTypes) => {
  const CommentExperience = sequelize.define(
    'CommentExperience',
    {
      text: DataTypes.TEXT,
      img: DataTypes.STRING,
      isHidden: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
      user: DataTypes.INTEGER,
      experience: DataTypes.INTEGER
    },
    {}
  );
  CommentExperience.associate = models => {
    CommentExperience.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    CommentExperience.belongsTo(models.Experience, {
      as: 'experiences',
      foreignKey: 'experience',
      onDelete: 'CASCADE'
    });
    CommentExperience.hasMany(models.ReplayExperienceComment, {
      foreignKey: 'experienceComment',
      allowNull: false
    });
    CommentExperience.hasMany(models.LikeCommentExperience, {
      foreignKey: 'commentExperience',
      allowNull: false
    });
  };
  return CommentExperience;
};
