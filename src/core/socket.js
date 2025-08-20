import { io } from "../index.js";

export const socketInitialization = () => {
  let users = {};
  io.on("connection", (socket) => {
    if(socket.id !== 'null') users[socket.id] = socket;

    socket.on('send-id', function(id) {
      if(id !== 'null') users[id] = socket;
      
  });
    
    socket.on("qqq", ({ content, to }) => {
      users[to] ? users[to].emit("private", {content, to}): null;
    });

    socket.on('disconnect', () => {
    })
  });
};
