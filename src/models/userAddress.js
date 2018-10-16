const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'userAddress',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
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
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'address',
      },
      roadNameAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'road_name_address',
      },
      addressDetail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'address_detail',
      },
      inUse: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        field: 'in_use',
      },
      deliveryAvailable: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: '0',
        field: 'delivery_available',
      },
      lunchDeliveryAvailable: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0',
        field: 'lunch_delivery_available',
      },
      breakfastDeliveryAvailable: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0',
        field: 'breakfast_delivery_available',
      },
      area: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'area',
      },
      reservationType: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'reservation_type',
      },
      lat: {
        type: 'DOUBLE',
        allowNull: false,
        defaultValue: '0',
        field: 'lat',
      },
      lon: {
        type: 'DOUBLE',
        allowNull: false,
        defaultValue: '0',
        field: 'lon',
      },
      timeAt: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
        field: 'time_at',
      },
      isDeleted: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '0',
        field: 'is_deleted',
      },
    },
    {
      tableName: 'user_address',
      timestamps: false,
    }
  );
