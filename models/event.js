module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      tagList: DataTypes.ARRAY('STRING'),
      category: DataTypes.STRING,
      location: DataTypes.STRING,
      numberDays: DataTypes.STRING,
      startTime: DataTypes.STRING,
      startDate: DataTypes.DATE,
      finishDate: DataTypes.DATE,
      eventType: DataTypes.BOOLEAN,
      favorited: DataTypes.BOOLEAN,
      favoritedCount: DataTypes.INTEGER,
      eventImage: DataTypes.STRING,
      currentMode: DataTypes.STRING,
      organizer: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      isLiked: DataTypes.BOOLEAN,
      likedBy: DataTypes.ARRAY('STRING'),
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User, {
      as: 'userfkey',
      foreignKey: 'slug',
      onDelete: 'CASCADE'
    });
    Event.hasMany(models.Likes, {
      foreignKey: 'slug',
    })
  };
  return Event;
};
