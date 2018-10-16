const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'deliveryMeta',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      eventType: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'event_type',
      },
      deliveryId: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: 'delivery_id',
      },
      orderId: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: 'order_id',
      },
      branchCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'branch_code',
      },
      submittedAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'submitted_at',
      },
      canceledAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'canceled_at',
      },
      assignedAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'assigned_at',
      },
      unassignedAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'unassigned_at',
      },
      pickedUpAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'picked_up_at',
      },
      delayedAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'delayed_at',
      },
      deliveredAt: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'delivered_at',
      },
      agentName: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'agent_name',
      },
      agentPhone: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'agent_phone',
      },
    },
    {
      tableName: 'delivery_meta',
      timestamps: false,
    }
  );
