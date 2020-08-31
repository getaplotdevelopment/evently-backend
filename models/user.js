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
      isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
      deviceToken: { type: DataTypes.STRING },
      phoneNumber: { type: DataTypes.STRING },
      location: { type: DataTypes.JSON },
      role: {
        type: DataTypes.STRING,
        references: { model: 'Roles', key: 'designation' }
      },
      isDeactivated: { type: DataTypes.BOOLEAN, defaultValue: false },
      isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }
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
      foreignKey: 'email'
    });
    User.hasMany(models.Ticket, {
      foreignKey: 'organizer',
      allowNull: false
    });
    User.hasMany(models.TicketCategory, {
      foreignKey: 'user',
      allowNull: true
    });
    User.hasMany(models.Feedback, {
      foreignKey: 'user'
    });
    User.belongsTo(models.Roles, {
      as: 'roles',
      foreignKey: 'role',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'id'
    });
    // User.hasMany(models.Forum, {
    //   foreignKey: 'connectedUser',
    //   allowNull: false
    // });
    // User.hasMany(models.commentEvent, {
    //   foreignKey: 'user',
    //   allowNull: false
    // });
    // User.hasMany(models.likeComment, {
    //   foreignKey: 'user',
    //   allowNull: false
    // });
    // User.hasMany(models.replayComment, {
    //   foreignKey: 'user',
    //   allowNull: false
    // });
    // User.hasMany(models.shareComment, {
    //   foreignKey: 'users',
    //   allowNull: false
    // });
    // User.hasMany(models.CommentExperience, {
    //   foreignKey: 'user',
    //   allowNull: false
    // });
  };
  return User;
};
