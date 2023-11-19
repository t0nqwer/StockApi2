import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
export const ServerSocket = new Server(httpServer);
ServerSocket.on("connection", (socket) => {});
httpServer.listen(8586);
// let io;
// export const socketServer = (server) => {
//   io = new Server(server);

//   io.on("connection", (socket) => {
//     console.log("a user connected", socket.id);

//     socket.on("disconnect", () => {
//       console.log("user disconnected");
//     });
//     socket.emit("notification", "hello world");
//   });
//   return io;
// };

// export const Notify = (data) => io.broadcast.emit("notification", data);
