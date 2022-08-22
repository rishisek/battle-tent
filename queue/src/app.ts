import express from "express";
import { createServer } from "http";
import routes from "./routes";

class App {
  public app;
  public server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;
