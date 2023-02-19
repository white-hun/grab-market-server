// DB 모델링
// models/index.js에 작성한 데이터를 sequelize를 읽어서 DB에게 명령을 내린다
module.exports = function (sequelize, DataTypes) {
  // table name: Product
  const product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(20), // 글자 길이 제한 20
      allowNull: false, // name column에 데이터를 무조건 작성해야하는 규칙
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  });
  return product;
};
