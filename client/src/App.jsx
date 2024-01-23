import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField } from "@mui/material";

const SERVER_URL = "http://localhost:8500/";

const App = () => {
  const socket = useMemo(() => io(SERVER_URL), []);
  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [recieveMsg, setRecieveMsg] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("front userId", socket.id);
      setUser(socket.id);
    });
    // socket.on("welcome", (a) => {
    //   console.log("welcome event", a);
    // });
    // socket.on("broadcast", (a) => {
    //   console.log("broadcast event", a);
    // });
    socket.on("recieveMsg", (data) => {
      setRecieveMsg(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { msg, room });
    setMsg("");
  };

  const handleRoomNameBlur=(txt)=>{
    socket.emit("joinRoom",roomName)
  }
  return (
    <Container>
      <h1>Welocome to Socket.io </h1>
      <h4>User: {user}</h4>

      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Msg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="roomID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onBlur={(e)=>handleRoomNameBlur(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          onClick={(e) => handleSubmit(e)}
        >
          Send
        </Button>
      </form>
      <br />
      <div> recieveMsg: {recieveMsg}</div>
    </Container>
  );
};

export default App;
