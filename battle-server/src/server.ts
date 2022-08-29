import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player, Battle } from "./battle";
import routes from "./routes";
import store from "./store";

let app = express();
let server = createServer(app);
let io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("socketio", io);
app.use(routes);
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join1", async (battleID) => {
    let battle = store.battles.get(battleID);
    if (!battle) return socket.emit("error");
    (async () => {
      for await (const output of battle.streams.omniscient) {
        socket.emit("stream", output);
      }
    })();
    new Player(battle.streams.p1, socket).start();
    console.log("k");
  });
  socket.on("join2", async (battleID) => {
    let battle = store.battles.get(battleID);
    if (!battle) return socket.emit("error");
    new Player(battle.streams.p2, socket).start();
  });
});

server.listen(5000, () => {
  console.log("UP");
});
