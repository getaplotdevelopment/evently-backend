module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Roles',
    {
      designation: DataTypes.STRING
    },
    {}
  );
  Roles.associate = function(models) {
    Roles.hasMany(models.User, {
      foreignKey: 'role',
      allowNull: false
    });
  };
  return Roles;
};
