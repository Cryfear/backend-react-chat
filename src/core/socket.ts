import socket, { Socket } from "socket.io";

export const createSocket = (http: Socket) => {
  const io = socket(http);

  io.on("connection", (socket: any) => {

    console.log("socket connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on("DIALOGS:JOIN", (msg: any) => {
      console.log(msg, "here");
    });

    

  });

  return io;
};
