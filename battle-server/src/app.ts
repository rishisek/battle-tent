import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import routes from "./routes";
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
        origin: "*",
      },
    });
    this.app.set("socketio", this.io);
    this.app.use(routes);
    this.middlewares();
  }

  middlewares() {
    this.app.use(express.json());
  }
}

export default new App().server;
