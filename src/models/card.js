const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'card',
    {
      idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      user_idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'user_idx',
      },
      billkey: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: 'billkey',
      },
      card_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'card_number',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'user_card_info',
      timestamps: false,
    }
  );
