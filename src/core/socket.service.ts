import type { Server } from "socket.io";

let io: Server | null = null;

export function setSocket(server: Server) {
  io = server;
}

export function getSocket(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}