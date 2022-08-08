import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import ISocket from "./socket";
import { pick } from "./routes";
import InMemorySessionStore from "./sessionStore";

import { randomBytes } from "crypto";
const randomId = () => randomBytes(8).toString("hex");

class App {
  public app;
  public server;
  public io;
  public sessionStore;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    this.app.set("socketio", this.io);

    this.sessionStore = new InMemorySessionStore();
    this.app.set("sessionStore", this.sessionStore);

    this.middlewares();
    this.routes();
    this.socket_routines();
  }

  socket_routines() {
    this.io.on("connection", (socket: ISocket) => {
      console.log("con");
      // persist session
      this.sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
      });

      // notify users upon disconnection
      socket.on("disconnect", async () => {
        const matchingSockets = await this.io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          // update the connection status of the session
          this.sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: false,
          });
          console.log("dis");
        }
      });
    });
    pick(this.io);
  }

  middlewares() {
    this.app.use(express.json());
    this.io.use((socket: ISocket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        // find existing session
        const session = this.sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }
      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }
      // create new session
      socket.sessionID = randomId();
      socket.userID = randomId();
      socket.username = username;
      next();
    });
  }

  routes() {}
}

export default new App().server;
