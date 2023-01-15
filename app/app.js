import express from "express";


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 41500;
server.listen(PORT);

console.log('Server is running ');
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/template-pages/index.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/template-pages/chat.html");
});
console.log('Routes OK');

const connections = [];

io.sockets.on("connection", socket => {
  connections.push(socket);
  console.log(" %s sockets is connected", connections.length);

  socket.on("sending message", message => {
    console.log("Message is receiveds :", message);

    io.sockets.emit("new message", { message: message });
  });

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
  });
});

console.log('Socket OK');


