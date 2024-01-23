import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //forall
    // origin: "http://localhost:5173/", //specific
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//io means circuit, socket.. individual socket
io.on("connection", (socket) => {
  console.log("user/socket id", socket.id);

  //   socket.emit("welcome", socket.id); // for particular user
  //   socket.broadcast.emit("broadcast", socket.id + "joined the server"); //uske alawa baaki ko

  //listening message event
  socket.on("message", (data) => {
    console.log(" msg:", data.msg);
    // io.emit("recieveMsg",data) //broadcast to everyone including me
    io.to(data.room).emit("recieveMsg", data.msg); //broadcast to everyone including me
    // socket.broadcast.emit("recieveMsg",data) //broadcast to everyone but me
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});

// app.listen creates new http server not the one we created
// app.listen(5000, () => {
//   console.log("server started");
// });

server.listen(8500, () => {
  console.log("our server started");
});
