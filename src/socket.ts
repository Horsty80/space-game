import { Server, Socket } from "socket.io";

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

    /**
     * logic for room joining
     **/
    socket.on("join_game", async (data: { roomId: string }) => {
      console.log("New User joining room:", { data });
      const connectedSockets = io.sockets.adapter.rooms.get(data.roomId);
      const socketRooms = Array.from(socket.rooms.values()).filter(
        (room: string) => room !== socket.id
      );
      if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2)) {
        console.log("errrro", socketRooms.length, connectedSockets.size);
        socket.emit("room_join_error", {
          error: "Room is full please choose another room to play!",
        });
      } else {
        await socket.join(data.roomId);
        socket.emit("room_joined");
      }
    });
    /**
     * Logic game
     */
    socket.on("update_game", async (data: any) => {
      const gameRoom = getSocketGameRoom(socket);
      socket.to(gameRoom).emit("on_game_update", data);
    });
  });

  return io;
};

function getSocketGameRoom(socket: Socket): string {
  const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id);
  const gameRoom = socketRooms && socketRooms[0];
  return gameRoom;
}
