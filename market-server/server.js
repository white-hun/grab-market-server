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

// 이 경로로(/products)method가 get인 요청이 왔을 때  arrow function 두번째 인자로 이하 실행
app.get("/products", (req, res) => {
  const query = req.query;
  console.log("QUERY : ", query);
  res.send({
    products: [
      {
        id: 1,
        name: "농구공",
        price: 100000,
        seller: "조던",
        imageUrl: "images/products/basketball1.jpeg",
      },
      {
        id: 2,
        name: "축구공",
        price: 50000,
        seller: "메시",
        imageUrl: "images/products/soccerball1.jpg",
      },
      {
        id: 3,
        name: "키보드",
        price: 10000,
        seller: "그랩",
        imageUrl: "images/products/keyboard1.jpg",
      },
    ],
  });
});

// body에 데이터를 담는 부분
// JS에서 객체를 표현할 때 ES6에서는 key와 value가 똑같다면
// 그때 생략 가능(body: body -> body)
app.post("/products", (req, res) => {
  const body = req.body;
  res.send({
    body,
  });
});

app.get("/products/:id/events/:eventId", (req, res) => {
  const params = req.params;
  const { id, eventId } = params;
  res.send(`id은 ${id} ${eventId}입니다.`);
});

app.listen(port, () => {
  console.log("쇼핑몰 서버가 실행 중 입니다");
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
