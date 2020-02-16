module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING, unique: true },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      avatar: { type: DataTypes.STRING },
      isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
      isOrganizer: { type: DataTypes.BOOLEAN, defaultValue: false },
      isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
      deviceToken: { type: DataTypes.STRING }
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.OrganizerProfile, {
      foreignKey: 'organizer',
      allowNull: false
    });
    User.hasMany(models.Event, {
      foreignKey: 'organizer',
      allowNull: false
    });
    User.hasMany(models.Likes, {
      foreignKey: 'email',
    })
  };
  return User;
};
