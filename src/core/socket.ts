import socket, { Socket } from "socket.io";

export default (http: Socket) => {
  const io = socket(http);

  io.on("connection", (socket: Socket) => {
    console.log("socket connected");
    socket.on("DIALOGS:JOIN", (msg: any) => {
      console.log(msg, 'here');
    });
  });

  return io;
};
