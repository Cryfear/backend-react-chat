import { io } from "../index.ts";

export const socketInitialization = () => {
  let users = {};
  io.on("connection", (socket) => {
    if(socket.id !== 'null') users[socket.id] = socket;

    socket.on('send-id', function(id) {
      if(id !== 'null') users[id] = socket;
      
  });
    
    socket.on("socketMessage", ({ content, to }) => {
      users[to] ? users[to].emit("private", {content, to}): null;
    });

    socket.on('disconnect', () => {
    })
  });
};
