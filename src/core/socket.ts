import socket from "socket.io";
import { Http2Server } from "http2";

export default (http: any) => {
  const io = socket(http);

  io.on("connection", (socket: any) => {
    console.log("socket connected");
    socket.on("DIALOGS:JOIN", (msg: any) => {
      console.log(msg);
    });
  });

  return io;
};
