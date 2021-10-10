import { Socket } from "socket.io";
import { io } from "..";

export const socketInitialization = () => {
  let users: any = {};
  io.on("connection", (socket: Socket) => {
    users[socket.id] = socket;

    socket.on('send-id', function(id: number) {
      users[id] = socket;
  });
    
    socket.on("qqq", ({ content, to }) => {
      users[to] ? users[to].emit("private", {content, to}): null;
    });

    socket.on('disconnect', () => {
    })
  });
};
