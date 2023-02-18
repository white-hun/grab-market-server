// express 라이브러리를 사용한 Node.js로 구축한 서버
// common JS 방식

const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
// // dest(destination) 다른데서 온 파일 어디에 저장 할지 저장 위치 선언
// const upload = multer({ dest: "uploads/" });
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
// express에 대해 설정
// 서버(express)에서 json 형식의 데이터를 처리할 수 있도록 해준다
app.use(express.json());
// 모든 브라우저에서 내가 만든 서버에 요청할 수 있다.
app.use(cors());

// 이 경로로(/products)method가 get인 요청이 왔을 때  두번째 인자 arrow function 실행
app.get("/products", (req, res) => {
  models.Product.findAll({
    // order 정렬방식 바꾸고 싶을 때
    // createdAt 기준으로 DESC(내림차순)
    order: [["createdAt", "DESC"]],
    // attribute findALl을 할 때 어떤 column 들을 가져올거냐
    // 설정한 것들 이외에는 가져오지 않겠다(설정한 정보들만 받겠다)
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
      res.send("에러 발생");
    });
});

// body

// body에 데이터를 담는 부분
// JS에서 객체를 표현할 때 ES6에서는 key와 value가 똑같다면
// 그때 생략 가능(body: body -> body)
app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, seller, description } = body;
  // 방어 코드
  if (!name || !price || !seller || !description) {
    res.send("모든 필드를 입력해주세요.");
  }
  models.Product.create({
    name,
    price,
    seller,
    description,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("상품 업로드에 문제가 발생했습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // 2개이상의 레코드를 찾고 싶을 때는 findAll, 한개는 findOne
  models.Product.findOne({
    // 조건문 where
    // 받아온 const {id}와 일치하는 정보를 불러와라
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("상품 조회 에러가 발생했습니다.");
    });
});

// single - 파일 하나만 보냈을 때 처리
// 파일을 보낼 때 항상 key가 있어야한다
// image라는 key 가 왔을때 처리하는 구문
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  res.send({
    imageUrl: file.path,
  });
});

// app.listen을 통해서 서버가 실행
// 정상적으로 실행됬을때 두번째 인자의 callback 함수가 실행
app.listen(port, () => {
  console.log("쇼핑몰 서버가 실행 중 입니다");
  // 실행됬을 때 동기화하는 작업(.sync)
  // (models파일로 생성된 sequrlize(index.js)를 불러온다)
  // index.js에서 상품과 관련된 테이블을 만들면 데이터베이스에서 상품과 관련되 테이블을 만든다
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
