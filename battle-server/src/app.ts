import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import ISocket from "./socket";
import routes, { pick } from "./routes";
import { runInThisContext } from "vm";

class App {
  public app;
  public server;
  public io;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    this.app.set("socketio", this.io);
    this.app.use(routes);
    this.middlewares();
    this.socket_routines();
  }

  socket_routines() {
    this.io.on("connection", (socket: ISocket) => {
      console.log("con");

      // notify users upon disconnection
      socket.on("disconnect", async () => {
        const matchingSockets = await this.io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
      });
    });
    pick(this.io);
  }

  middlewares() {
    this.app.use(express.json());
  }
}

export default new App().server;
