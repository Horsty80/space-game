// import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connect", (socket) => {
    console.log("connec in calback", socket.id);

    socket.on("custom_event", (data: any) => {
      console.log("Data: ", data);
    });

    socket.on("join_game", async (data: { roomId: string }) => {
      console.log("New User joining room:", { data });
      const connectedSockets = io.sockets.adapter.rooms;
      const socketRooms = Array.from(socket.rooms.values()).filter(
        (room: string) => room !== socket.id
      );
      if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2)) {
        socket.emit("room_join_error", {
          error: "Room is full please choose another room to play!",
        });
      } else {
        await socket.join(data.roomId);
        socket.emit("room_joined");
      }
    });
  });

  //   useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.ts"] });

  return io;
};
