const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'meta',
    {
      key: {
        type: DataTypes.STRING(45),
        primaryKey: true,
        field: 'key',
      },
      value: {
        type: DataTypes.STRING(1023),
        field: 'value',
      },
    },
    {
      tableName: 'meta',
      timestamps: false,
    }
  );
