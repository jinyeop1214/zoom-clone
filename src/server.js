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

const publicRooms = () => {
	const {
		sockets: {
			adapter: { sids, rooms },
		},
	} = wsServer;
	const publicRooms = [];
	rooms.forEach((_, key) => {
		if (sids.get(key) === undefined) publicRooms.push(key);
	});
	return publicRooms;
};

//socket은 object
wsServer.on("connection", (socket) => {
	socket["nickname"] = "Anon";
	socket.onAny((event) => {
		// console.log(wsServer.sockets.adapter);
		console.log(`Socket Event: ${event}`);
	});
	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName);
		done();
		socket.to(roomName).emit("welcome", socket.nickname); // 내소켓 빼고 방안에 있는 모든 소켓에게 보냄.
	});
	socket.on("disconnecting", () => {
		socket.rooms.forEach((room) =>
			socket.to(room).emit("bye", socket.nickname)
		);
	});
	socket.on("new_message", (msg, room, done) => {
		socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
		done();
	});
	socket.on("nickname", (nickname, done) => {
		socket["nickname"] = nickname;
		done();
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
