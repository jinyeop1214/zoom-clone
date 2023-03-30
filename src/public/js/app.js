//wsSocket -> SocketIO 장점 1. 어느 이벤트든지 보내기 가능. message only가 아니라. 2. Object 혹은 아무거나 여러개 전송 가능. stringify, parse 안해도됨. 3. 최고는 서버에서 호출되는 콜백함수. 서버가 함수를 호출하고 함수는 프론트엔드에서 실행됨. (socket.emit의 1,2,.. ,마지막 번째 arguments) 이 함수는 백엔드에서 실행되는거아님! 프론트에서 짠 함수가 백엔드에서 실행된다면 심각한 보안 문제. 할라면 emit의 마지막 argument가 function이기만 하면 됨.

const socket = io(); //how 어떻게 백엔드에서 실행되는 socket.io를 알아서 찾지
const welcome = document.getElementById("welcome");
const nickname = welcome.querySelector("#name");
const enter = welcome.querySelector("#enter");
const room = document.getElementById("room");

room.hidden = true;
enter.hidden = true;

let roomName;

const addMessage = (message) => {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = message;
	ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
	event.preventDefault();
	const input = room.querySelector("#msg input");
	const value = input.value;
	socket.emit("new_message", input.value, roomName, () => {
		addMessage(`You: ${value}`);
	});
	input.value = "";
};

const showRoom = () => {
	nickname.hidden = false;
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName}`;

	const msgForm = room.querySelector("#msg");
	msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
	event.preventDefault();
	const input = enter.querySelector("input");
	socket.emit("enter_room", input.value, showRoom);
	roomName = input.value;
	input.value = "";
};

const showEnter = () => {
	nickname.hidden = true;
	enter.hidden = false;
	enter.addEventListener("submit", handleRoomSubmit);
};

const handleNicknameSubmit = (event) => {
	event.preventDefault();
	const input = nickname.querySelector("#name input");
	socket.emit("nickname", input.value, showEnter);
	input.value = "";
};

nickname.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;

	addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;

	addMessage(`${left} left ㅠㅜ`);
});

socket.on("new_message", addMessage); //밑에랑 같다. 왜 같은지 공부
// socket.on("new_message", (msg) => {
// 	addMessage(msg);
// });

socket.on("room_change", (rooms) => {
	const roomList = welcome.querySelector("ul");
	roomList.innerHTML = "";
	if (rooms.length === 0) {
		return;
	}
	rooms.forEach((room) => {
		const li = document.createElement("li");
		li.innerText = room;
		roomList.append(li);
	});
});
// socket.on("room_change", console.log);
// socket.on("room_change", (msg) => console.log(msg));
