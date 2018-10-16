const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'couponTxn',
    {
      id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'user_idx',
      },
      couponId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'coupon_idx',
      },
      isUsed: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'is_used',
        defaultValue: 0,
      },
      publishDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
        field: 'publish_date',
      },
      validDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'valid_date',
      },
      useDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'use_date',
      },
    },
    {
      tableName: 'coupon_txn',
      timestamps: false,
    }
  );
