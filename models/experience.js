module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    'Experience',
    {
      text: DataTypes.TEXT,
      img: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
      user: DataTypes.INTEGER
    },
    {}
  );
  Experience.associate = models => {
    Experience.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    Experience.hasMany(models.CommentExperience, {
      foreignKey: 'experience',
      allowNull: false
    });
    Experience.hasMany(models.LikeExperience, {
      foreignKey: 'experience',
      allowNull: false
    });
  };
  return Experience;
};
