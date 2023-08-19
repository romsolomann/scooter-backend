// import http from "http";
// import { Server } from "socket.io";
// import sharedSession from "express-socket.io-session";
// import asyncLocalStorage from "./als.service";
// import { Socket } from "socket.io";
// import { logger } from "./logger.service";
// import { Session } from "express-session"; // Import the Session type
// import { CustomStore } from "../interfaces/als.interface";

// let gIo: Server | null = null;
// const gSocketBySessionIdMap: { [sessionId: string]: Socket | null } = {};

// function connectSockets(httpServer: http.Server, session: Session) {
//   gIo = new Server(httpServer);

//   gIo.use((session) => {
//     sharedSession(session, {
//       autoSave: true,
//     });
//   });

//   gIo.on("connection", (socket: Socket) => {
//     console.log(
//       "New socket - socket.handshake.sessionID",
//       socket.handshake.sessionID
//     );
//     gSocketBySessionIdMap[socket.handshake.sessionID] = socket;

//     socket.on("disconnect", () => {
//       console.log("Someone disconnected");
//       if (socket.handshake && socket.handshake.sessionID) {
//         gSocketBySessionIdMap[socket.handshake.sessionID] = null;
//       }
//     });

//     socket.on("chat topic", (topic: string) => {
//       if (socket.myTopic === topic) return;
//       if (socket.myTopic) {
//         socket.leave(socket.myTopic);
//       }
//       socket.join(topic);
//       socket.myTopic = topic;
//     });

//     socket.on("chat newMsg", (msg: any) => {
//       if (socket.myTopic) {
//         gIo?.to(socket.myTopic).emit("chat addMsg", msg);
//       }
//     });

//     socket.on("user-watch", (userId: string) => {
//       socket.join(userId);
//     });
//   });
// }

// function emitToAll({
//   type,
//   data,
//   room = null,
// }: {
//   type: string;
//   data: any;
//   room?: string | null;
// }) {
//   if (room) {
//     gIo?.to(room).emit(type, data);
//   } else {
//     gIo?.emit(type, data);
//   }
// }

// function emitToUser({
//   type,
//   data,
//   userId,
// }: {
//   type: string;
//   data: any;
//   userId: string;
// }) {
//   gIo?.to(userId).emit(type, data);
// }

// function broadcast({
//   type,
//   data,
//   room = null,
// }: {
//   type: string;
//   data: any;
//   room?: string | null;
// }) {
//   const store = asyncLocalStorage.getStore() as CustomStore;
//   const { sessionId } = store;

//   if (!sessionId) {
//     logger.debug("Shouldn't happen, no sessionId in asyncLocalStorage store");
//     return;
//   }

//   const excludedSocket = gSocketBySessionIdMap[sessionId];
//   if (!excludedSocket) {
//     logger.debug("Shouldn't happen, No socket in map");
//     return;
//   }

//   if (room) {
//     excludedSocket.broadcast.to(room).emit(type, data);
//   } else {
//     excludedSocket.broadcast.emit(type, data);
//   }
// }

// export { connectSockets, emitToAll, emitToUser, broadcast };
