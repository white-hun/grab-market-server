// express 프레임워크를 사용한 Node.js로 구축한 서버
// common JS 방식

const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
// // dest(destination) 다른데서 온 파일 어디에 저장 할지 저장 위치 선언
// // 생성시 파일 이름 데이터가 일반적이지 않음
// const upload = multer({ dest: "uploads/" });

// 이미지 이름을 url로 사용
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8090;

// app. - API 생성
// express에 대해 설정(get, post 처리할 때 그 위에 설정)
// 서버(express)에서 json 형식의 데이터를 처리할 수 있도록 해준다
app.use(express.json());
// 모든 브라우저에서 내가 만든 서버에 요청할 수 있다.
app.use(cors());
// 입력한 경로로 보여주기 위한 설정
// express 서버에서 클라이언트에게 정적(static)인 데이터(이미지, 비디오 등)를 제공하기 위해서 필요한 코드
// 첫번째 인자인 '/uploads'는 url뒤에 path를 붙여서 서버URL/uploads/파일명 이렇게 접근하도록 설정
// 두번째 인자인 express.static('uploads') 는 express 프로젝트 내부에 있는 uploads 폴더의 파일들을 제공
app.use("/uploads", express.static("uploads"));

// 상품정보 API
// 이 경로로(/products) method가 get인 요청이 왔을 때  두번째 인자 arrow function 실행
app.get("/products", (req, res) => {
  models.Product.findAll({
    // order 정렬방식 바꾸고 싶을 때
    // createdAt 기준으로 DESC(내림차순)
    order: [["createdAt", "DESC"]],
    // attribute findALl을 할 때 어떤 column 들을 가져올거냐
    //  ↳ 설정한 것들 이외에는 가져오지 않겠다(설정한 정보들만 받겠다)
    //  ↳ 필요없는 데이터의 사용을 줄여 트래픽을 줄이고, 보안이 필요한 데이터를 노출할 위험을 방지하기 위해 필요
    attributes: ["id", "name", "price", "seller", "createdAt", "imageUrl"],
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
});

// body

// 상품 생성 API
// JS에서 객체를 표현할 때 ES6에서는 key와 value가 똑같다면
// 생략 가능(name: name -> body)
app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description, imageUrl } = body;
  // 방어 코드
  if (!name || !price || !seller || !description || !imageUrl) {
    // 사용자 에러 코드 400를 넣어준다
    res.status(400).send("모든 필드를 입력해주세요.");
  }
  models.Product.create({
    name,
    price,
    seller,
    description,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
});

// 상품 상세정보 API
app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // 2개이상의 레코드를 조회할 때는 findAll, 한개는 findOne
  models.Product.findOne({
    // 조건문 where
    // column id와 변수 바인딩 id 가 일치하는 id를 불러와라
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        // 객체 전달
        // Product 객체의 product key
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회 에러가 발생했습니다.");
    });
});

// single - 파일 하나만 보냈을 때 처리
// 파일을 보낼 때 항상 key가 있어야한다
// image라는 key에 파일이 왔을때 처리하는 구문
// image 파일을 해당경로(/image)에서 post 요청으로 multipart 폼 형식의 데이터 요청이 왔을 때
// upload.single을 통해서 uploads라는 폴더에 해당 image가 저장이 된다
app.post("/image", upload.single("image"), (req, res) => {
  // req.file에 저장된 이미지 정보를 얻을 수 있다
  const file = req.file;
  res.send({
    // file의 다양한 정보 중 path를 사용하는데, 이 path가 imageurl이된다
    imageUrl: file.path,
  });
});

// app.listen을 통해서 서버가 실행
// 정상적으로 실행됬을때 두번째 인자의 callback 함수가 실행
app.listen(port, () => {
  console.log("쇼핑몰 서버가 실행 중 입니다");
  // 실행됬을 때 동기화하는 작업(.sync)
  // (models파일로 생성된 sequrlize(index.js)를 불러온다)
  // models에 테이블에 관련된 모델링이 필요한 정보를 넣는다
  // models/index.js의 정보를 데이터베이스와 동기화 시킨다
  // ()index.js에서 상품과 관련된 테이블을 만들면 데이터베이스에서 상품과 관련되 테이블을 만든다)
  // sequelize와 splite를 연동시켜서 sequelize로 명령을 줬을 때 splite로 정보를
  // promise 구조 비동기 처리(then, catch)
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});

// postman 서버(My Workspace)
// get product - 메인페이지의 상품 리스트
// create product - 데이터베이스에 새로운 제품 table 추가
// get product - 상품 상세 페이지
// image uplodd - 이미지 url 생성
