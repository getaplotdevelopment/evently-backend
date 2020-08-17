module.exports = (sequelize, DataTypes) => {
  const ReportContent = sequelize.define(
    'ReportContent',
    {
      entity: DataTypes.STRING,
      designation: DataTypes.STRING,
      entityId: DataTypes.INTEGER,
      user: DataTypes.INTEGER
    },
    {}
  );
  ReportContent.associate = models => {
    ReportContent.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };
  return ReportContent;
};
