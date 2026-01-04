import { getSocket } from "./socket.service.js";

export function initSocket() {
  const io = getSocket();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  });
}