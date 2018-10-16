const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'b2bOrderMeta',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      userIdx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'user_idx',
      },
      status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        field: 'status',
      },
      reserveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
        field: 'reserve_date',
      },
      orderMenuName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'order_menu_name',
      },
      orderItemBarcode: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'order_item_barcode',
      },
      itemName: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'item_name',
      },
      sellPrice: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
        field: 'sell_price',
      },
      itemAmount: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
        field: 'item_amount',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'employee_id',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'email',
      },
      recipientName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'recipient_name',
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'department',
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'location',
      },
      companyId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'company_id',
      },
      serviceType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'service_type',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'b2b_order_meta',
      timestamps: false,
    }
  );
