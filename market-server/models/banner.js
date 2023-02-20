// 배너 테이블 등록
module.exports = function (sequelize, dataTypes) {
  // 테이블명 Banner
  const banner = sequelize.define("Banner", {
    // 넣어줄 값들(imageUrl, href)
    imageUrl: {
      type: dataTypes.STRING(300),
      allowNull: false,
    },
    // imageUrl을 클릭했을 때 어떤 경로로 페이지 이동 시킬건지
    href: {
      type: dataTypes.STRING(200),
      allowNull: false,
    },
  });
  return banner;
};
