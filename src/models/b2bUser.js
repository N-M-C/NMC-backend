const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'b2bUser',
    {
      idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },

      companyId: {
        type: DataTypes.INTEGER(11),
        field: 'company_id',
      },

      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'user_id',
      },

      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'password',
      },

      passwordSalt: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'password_salt',
      },

      location: {
        type: DataTypes.STRING(50),
        field: 'location',
      },

      department: {
        type: DataTypes.STRING(50),
        field: 'department',
      },

      mobile: {
        type: DataTypes.STRING(45),
        field: 'mobile',
      },

      email: {
        type: DataTypes.STRING(50),
        field: 'email',
      },

      userName: {
        type: DataTypes.STRING(45),
        field: 'user_name',
      },

      profileImage: {
        type: DataTypes.TEXT,
        field: 'profile_image',
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
      },

      memo: {
        type: DataTypes.TEXT,
        field: 'memo',
      },
    },
    {
      tableName: 'b2b_user',
      timestamps: false,
    }
  );
