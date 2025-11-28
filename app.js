const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const { isReal } = require("./public/javascripts/isUserValid");
const app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat guys..!!",
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New pig joined the chat..",
    createdAt: new Date().getTime(),
  });

  socket.on("join", (obj, callback) => {
    if (!isReal(obj.name) || !isReal(obj.roomID)) {
      callback("Name and roomID are required !!");
    }

    callback();
  });

  socket.on("createMessage", (message) => {
    console.log(message);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000);
