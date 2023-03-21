//wsSocket -> SocketIO 장점 1. 어느 이벤트든지 보내기 가능. message only가 아니라. 2. Object 혹은 아무거나 여러개 전송 가능. stringify, parse 안해도됨. 3. 최고는 서버에서 호출되는 콜백함수. 서버가 함수를 호출하고 함수는 프론트엔드에서 실행됨. (socket.emit의 1,2,.. ,마지막 번째 arguments) 이 함수는 백엔드에서 실행되는거아님! 프론트에서 짠 함수가 백엔드에서 실행된다면 심각한 보안 문제. 할라면 emit의 마지막 argument가 function이기만 하면 됨.

const socket = io(); //how 어떻게 백엔드에서 실행되는 socket.io를 알아서 찾지
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = message;
	ul.appendChild(li);
};

const showRoom = () => {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName}`;
};

const handleRoomSubmit = (event) => {
	event.preventDefault();
	const input = form.querySelector("input");
	socket.emit("enter_room", input.value, showRoom);
	roomName = input.value;
	input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
	addMessage("Someone joined!");
});
