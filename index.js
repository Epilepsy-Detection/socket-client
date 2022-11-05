const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("connected successfulyl!");

  const reader = fs.createReadStream(__dirname + "/testo.txt");

  reader.on("data", (chunk) => {
    socket.emit("new-message", chunk);
  });
});

socket.on("disconnect", () => {
  console.log("disconnected successfully!");
});
