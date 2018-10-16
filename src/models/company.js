const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'company',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },

      name: {
        type: DataTypes.STRING(255),
      },

      engName: {
        type: DataTypes.STRING(45),
        field: 'eng_name',
      },

      address: {
        type: DataTypes.STRING(255),
      },

      roadNameAddress: {
        type: DataTypes.STRING(255),
        field: 'road_name_address',
      },

      addressDetail: {
        type: DataTypes.TEXT,
        field: 'address_detail',
      },

      inUse: {
        type: DataTypes.INTEGER(4),
        field: 'in_use',
      },

      area: {
        type: DataTypes.STRING(45),
      },

      lunchDeliveryAvailable: {
        type: DataTypes.INTEGER(4),
        field: 'lunch_delivery_available',
      },

      deliveryAvailable: {
        type: DataTypes.INTEGER(4),
        field: 'delivery_available',
      },

      lat: {
        type: DataTypes.DOUBLE,
      },

      lon: {
        type: DataTypes.DOUBLE,
      },
    },
    {
      tableName: 'company',
      timestamps: false,
    }
  );
