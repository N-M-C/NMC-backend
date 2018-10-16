const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'menuDaily',
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'idx',
      },

      serveDate: {
        type: DataTypes.DATEONLY,
        field: 'serve_date',
      },

      menuId: {
        type: DataTypes.INTEGER(11),
        field: 'menu_idx',
      },

      stock: DataTypes.INTEGER(5),

      ordered: DataTypes.INTEGER(5),

      isEvent: {
        type: DataTypes.INTEGER(11),
        field: 'is_event',
        defaultValue: 0,
      },

      isNew: {
        type: DataTypes.INTEGER(11),
        field: 'is_new',
        defaultValue: 0,
      },

      isB2BFeatured: {
        type: DataTypes.INTEGER(11),
        field: 'is_b2b_featured',
        defaultValue: 0,
      },

      area: DataTypes.STRING(45),

      priority: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      menuDailycol: {
        type: DataTypes.STRING(45),
        field: 'menu_dailycol',
      },

      serviceType: {
        type: DataTypes.STRING(45),
        field: 'service_type',
      },
    },
    {
      tableName: 'menu_daily',
      timestamps: false,
    }
  );
