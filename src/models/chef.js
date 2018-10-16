const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'chef',
    {
      id: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      nameChef: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'name_chef',
      },
      nameChefEng: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'name_chef_eng',
      },
      imageUrlChef: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'image_url_chef',
      },
      imageUrlChef2: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'image_url_chef2',
      },
      careerSumm: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'career_summ',
      },
      career: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'career',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: seq.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'chef',
      timestamps: false,
    }
  );
