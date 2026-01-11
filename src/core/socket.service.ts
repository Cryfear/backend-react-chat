import type { Server, Socket } from "socket.io";
import { registerTypingHandlers } from "./socket.typing.js";

let io: Server;

export function getSocket(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export const setSocket = (serverIO: Server) => {
  io = serverIO;
  if (!io) return;

  io.on("connection", (socket: Socket) => {
    socket.on("auth", (userId: string) => {
      console.log("user auth succesful: ", userId);
      socket.data.userId = userId;
      socket.join(`user:${userId}`);
    });

    socket.on("dialog:join", (dialogId: string) => {
      console.log("user joined dialog: ", dialogId);
      socket.join(`dialog:${dialogId}`);
    });

    socket.on("dialog:leave", (dialogId: string) => {
      console.log("user leaved dialog: ", dialogId);
      socket.leave(`dialog:${dialogId}`);
    });

    registerTypingHandlers(io, socket);
  });
};

export const getIO = (): Server => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
