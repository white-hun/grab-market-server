var http = require("http");
var hostname = "127.0.0.1"; // 어떤 컴퓨터든 자신의 컴퓨터는 항상 같은 IP 주소를 가진다
var port = 8090;

// 서버를 만들어주는 명령어
// 인자가 2개인 callback 함수
// 서버에서 요청이 왔을 때 callback 구조로 호출
// req(request): 클라이언트가 요청했을 때 요청 정보
// res(response): 응답을 해줘야할 객체
const server = http.createServer(function (req, res) {
  console.log("REQUEST : ", req); // 요청을 했을 때 req에 뭐가 들어오는지 확인
  res.end("Hello Client!"); // res에서 end 명령으로 "" 해당 스트링을 반환
});

// listen: 개발용어에서 기다리고 있다는 의미
// port, hostname으로 요청을 기다리고 있겠다
server.listen(port, hostname);

console.log("grab market server on!");
