import { Server, Socket } from "socket.io";

const typingTimeouts = new Map<string, NodeJS.Timeout>();

export function registerTypingHandlers(io: Server, socket: Socket) {
  socket.on("typing:start", ({ dialogId }) => {
    const room = `dialog:${dialogId}`;

    socket.to(room).emit("typing:start", {
      dialogId,
      from: socket.data.userId,
    });

    clearTimeout(typingTimeouts.get(socket.id));

    typingTimeouts.set(
      socket.id,
      setTimeout(() => {
        socket.to(room).emit("typing:stop", {
          dialogId,
          from: socket.data.userId,
        });
      }, 3000)
    );
  });

  socket.on("typing:stop", ({ dialogId }) => {
    socket.to(`dialog:${dialogId}`).emit("typing:stop", {
      dialogId,
      from: socket.data.userId,
    });
  });
}
