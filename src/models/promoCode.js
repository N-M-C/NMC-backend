const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'promo_code',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      promoCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'code',
      },
      eventMoney: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        defaultValue: '0',
        field: 'value',
      },
      available: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'available',
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'type',
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expire_at',
      },
      isOneOff: {
        type: DataTypes.TINYINT(4),
        allowNull: true,
        field: 'is_one_off',
      },
      dailyMaximumUsingCount: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        field: 'daily_maximum_using_count',
      }
    },
    {
      tableName: 'promo_code',
      timestamps: false,
    }
  );
