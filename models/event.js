module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      tagList: DataTypes.ARRAY('STRING'),
      category: DataTypes.STRING,
      numberDays: DataTypes.STRING,
      startTime: DataTypes.STRING,
      startDate: DataTypes.DATE,
      finishDate: DataTypes.DATE,
      eventType: DataTypes.BOOLEAN,
      favorited: DataTypes.BOOLEAN,
      favoritedCount: DataTypes.INTEGER,
      eventImage: DataTypes.STRING,
      eventStatus: DataTypes.STRING,
      organizer: DataTypes.JSON,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
