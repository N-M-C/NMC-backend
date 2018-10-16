const { DataTypes } = require('sequelize');

module.exports = seq =>
  seq.define(
    'menu',
    {
      id: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idx',
      },
      menuType: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'menu_type',
      },
      isBackban: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        defaultValue: '0',
        field: 'is_backban',
      },
      eventType: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'event_type',
      },
      nameMenu: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'name_menu',
      },
      nameMenuKor: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'name_menu_kor',
      },
      nameMenuEng: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'name_menu_eng',
      },
      foodflyName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'foodfly_name',
      },
      shortName: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'short_name',
      },
      price: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        field: 'price',
      },
      altPrice: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        field: 'alt_price',
      },
      b2BPrice: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        defaultValue: '0',
        field: 'b2b_price',
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'rating',
      },
      reviewCount: {
        type: DataTypes.INTEGER(5),
        allowNull: true,
        field: 'review_count',
      },
      imageUrlMenu: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'image_url_menu',
      },
      detailImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'detail_image_url',
      },
      idxChef: {
        type: DataTypes.INTEGER(5),
        allowNull: false,
        field: 'idx_chef',
      },
      priority: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'priority',
      },
      ready: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '1',
        field: 'ready',
      },
      story: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'story',
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ingredients',
      },
      calories: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
        defaultValue: '0',
        field: 'calories',
      },
      microwave: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0',
        field: 'microwave',
      },
      isRequireAdult: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '0',
        field: 'is_require_adult',
      },
      isAvailablePoint: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '1',
        field: 'is_available_point',
      },
      isAvailableCoupon: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: '1',
        field: 'is_available_coupon',
      },
      video360P: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'video_360p',
      },
      video720P: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'video_720p',
      },
      videoWeb: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'video_web',
      },
      videoOriginal: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'video_original',
      },
    },
    {
      tableName: 'menu',
      timestamps: false,
    }
  );
