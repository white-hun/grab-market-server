// express
// common JS 방식

const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8090;

// express에 대해 설정
// 서버(express)에서 json 형식의 데이터를 처리할 수 있도록 해준다
app.use(express.json());
// 모든 브라우저에서 내가 만든 서버에 요청할 수 있다.
app.use(cors());

// 이 경로로(/products)method가 get인 요청이 왔을 때  두번째 인자 arrow function 실행
app.get("/products", (req, res) => {
  models.Product.findAll()
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

app.get("/products/:id/events/:eventId", (req, res) => {
  const params = req.params;
  const { id, eventId } = params;
  res.send(`id은 ${id} ${eventId}입니다.`);
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
