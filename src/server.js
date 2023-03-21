//backend
// console.log(message.toString("utf8"));

import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
	console.log(`Listening on ws, http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
	socket.onAny((event) => {
		console.log(`Socket Event: ${event}`);
	});
	socket.on("enter_room", (roomName, done) => {
		console.log(socket.id); //나와의 대화 방으로 쓰면 되겠네 소켓 id = 소켓 혼자만의 private Room id
		console.log(socket.rooms); // Set { <socket.id> }≈
		socket.join(roomName);
		console.log(socket.rooms); // Set { <socket.id>, "room1" }≈
		setTimeout(() => {
			done("hello from the backend"); //백엔드가 done 함수 안의 코드 실행시키는 거 아님. 보안 문제 생김.(ex. DB 지우는 코드면 클나니까) 프론트엔드에서 done을 실행시킬거임. 근데 백에서 인자 넣어주기도 가능 // how 이게 가능?
		}, 15000);
	});
});

// ws 코드
// const wss = new WebSocket.Server({ server });

// const sockets = [];

// function onSocketClose() {
// 	console.log("Disconnected from the Browser.");
// }

// wss.on("connection", (socket) => {
// 	sockets.push(socket);
// 	socket["nickname"] = "Anon";
// 	console.log("Connected to Browser.");
// 	socket.on("message", (msg) => {
// 		const message = JSON.parse(msg);
// 		switch (message.type) {
// 			case "new_message":
// 				sockets.forEach((aSocket) =>
// 					aSocket.send(`${socket.nickname}: ${message.payload}`)
// 				);
// 			case "nickname":
// 				socket["nickname"] = message.payload;
// 		}
// 	});
// 	socket.on("close", onSocketClose);
// });

httpServer.listen(3000, handleListen);
