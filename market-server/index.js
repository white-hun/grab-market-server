var http = require("http");
var hostname = "127.0.0.1";
var port = 8090;

// 서버에 어떤 요청이 오든 callback함수가 호출이된다
// 그때 요청을 각각 나눠서 처리해야한다
// request할 때 http에서는 request에 method를 담는다
// method(GET, POST)에 따라서 다르게 처리
// Nodejs에서 배열을 보내줘야할 때 writehead 사용
const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      // Content-Type - 어떤 형식의 데이터인지
      // 정상적으로 요청했을 때 status code 200, JS object구조의 JSON형식의 응답을 보낸다
      res.writeHead(200, { "Content-Type": "application/json" });
      // JSON.stringify로 JSnp배열형태를 string 형태으로 바꿔준다
      const products = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      // end 함수 첫번째 인자에는 string 형식이 들어가야한다
      res.end(products);
    } else if (method === "POST") {
    }
  }
  res.end("생성되었습니다.");
});

server.listen(port, hostname);

console.log("grab market server on!");
//------------------------------------------------------------------------------------

// var http = require("http");
// var hostname = "127.0.0.1"; // 어떤 컴퓨터든 자신의 컴퓨터는 항상 같은 IP 주소를 가진다
// var port = 8090;

// // 서버를 만들어주는 명령어
// // 인자가 2개인 callback 함수
// // 서버에서 요청이 왔을 때 callback 구조로 호출
// // req(request): 클라이언트가 요청했을 때 요청 정보
// // res(response): 응답을 해줘야할 객체
// const server = http.createServer(function (req, res) {
//   console.log("REQUEST : ", req); // 요청을 했을 때 req에 뭐가 들어오는지 확인
//   res.end("Hello Client!"); // res에서 end 명령으로 "" 해당 스트링을 반환
// });

// // listen: 개발용어에서 기다리고 있다는 의미
// // port, hostname으로 요청을 기다리고 있겠다
// server.listen(port, hostname);

// console.log("grab market server on!");
