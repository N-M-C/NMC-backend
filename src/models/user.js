const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },

      companyId: {
        type: DataTypes.INTEGER(11),
        field: 'company_idx',
      },

      purchased: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },

      userCode: {
        type: DataTypes.STRING(11),
        field: 'user_code',
      },

      refUserId: {
        type: DataTypes.INTEGER(11),
        field: 'ref_user_idx',
      },

      mobile: {
        type: DataTypes.STRING(45),
      },

      point: {
        type: DataTypes.INTEGER(6),
        allowNull: false,
        defaultValue: 0,
      },

      loginType: {
        type: DataTypes.STRING(45),
        field: 'login_type',
      },

      userId: {
        type: DataTypes.STRING(200),
        field: 'user_id',
      },

      nickname: {
        type: DataTypes.STRING(45),
      },

      firstName: {
        type: DataTypes.STRING(45),
      },

      email: {
        type: DataTypes.TEXT,
      },

      freeCredit: {
        type: DataTypes.INTEGER(2),
        field: 'free_credit',
      },

      device: {
        type: DataTypes.STRING(10),
      },

      deviceName: {
        type: DataTypes.TEXT,
        field: 'device_name',
      },

      osType: {
        type: DataTypes.STRING(10),
        field: 'os_type',
      },

      osVersion: {
        type: DataTypes.STRING(10),
        field: 'os_version',
      },

      pushToken: {
        type: DataTypes.TEXT,
        field: 'push_token',
      },

      lat: {
        type: DataTypes.DOUBLE,
      },

      lon: {
        type: DataTypes.DOUBLE,
      },

      birthday: {
        type: DataTypes.DATEONLY,
      },

      gender: {
        type: DataTypes.STRING(11),
      },

      thumbnailImage: {
        type: DataTypes.TEXT,
        field: 'thumbnail_image',
      },

      profileImage: {
        type: DataTypes.TEXT,
        field: 'profile_image',
      },

      userName: {
        type: DataTypes.STRING(45),
        field: 'user_name',
      },

      lastName: {
        type: DataTypes.STRING(45),
      },

      linkURL: {
        type: DataTypes.TEXT,
      },

      refreshDate: {
        type: DataTypes.DATE,
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
      },

      isRefered: {
        type: DataTypes.BOOLEAN,
        field: 'is_refered',
      },

      identityVerify: {
        type: DataTypes.STRING(45),
        field: 'identity_verify',
      },

      realName: {
        type: DataTypes.STRING(45),
        field: 'real_name',
      },

      memo: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'user',
      timestamps: false,
    }
  );
