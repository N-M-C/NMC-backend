const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'orderDetail',
    {
      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      orderId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'order_idx',
      },
      menuId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'menu_idx',
      },
      amount: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'amount',
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: '0',
        field: 'rating',
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'comment',
      },
      bestReview: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: '0',
        field: 'best_review',
      },
      ratedTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'rated_time',
      },
      isReviewed: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '0',
        field: 'is_reviewed',
      },
    },
    {
      tableName: 'order_detail',
      timestamps: false,
    }
  );
