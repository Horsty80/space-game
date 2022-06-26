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
  });

  //   useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.ts"] });

  return io;
};
