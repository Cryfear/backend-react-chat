import { io } from "..";

export const socketInitialization = () => {
  const users: any = {};
  io.on("connection", (socket: any) => {
    
    users[socket.id] = socket;

    socket.on('send-id', function(id: number) {
      users[id] = socket;
  });
    
    socket.on("qqq", ({ content, to }: any) => {
      users[to] ? users[to].emit("private", {content, to}): null;
    });

    socket.on('disconnect', () => {
    })
  });
};
