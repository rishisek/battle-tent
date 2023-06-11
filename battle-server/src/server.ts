import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Player, Battle, User } from "./battle";
import routes from "./routes";
import { BattleStreams, RandomPlayerAI, Teams } from "@pkmn/sim";

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

const queue: User[] = [];
const battles: { [key: string]: Battle } = {};
const userSockets: { [key: string]: Socket } = {};
const userPlayers: { [key: string]: Player } = {};

io.on("connection", (socket) => {
  console.log("connected");
  
  socket.on("disconnect", () => {
    if (userSockets.hasOwnProperty(socket.data.user)) {
      delete userSockets[socket.data.user];
    }
  });

  socket.on("join", (username: string) => {
    socket.data.user = username;
    userSockets[username] = socket;
    if (userPlayers.hasOwnProperty(username)) {
      // console.log(userPlayers[user.name].log);
      userPlayers[username].setSocket(socket);
      socket.emit("battle-found");
    } else {
      socket.emit("no-battle-found");
    }

    // console.log(userSockets, userPlayers);
  });

  socket.on("rejoin-battle", (username: string) => {
    console.log("rejoin attempted", username);
    const player = userPlayers[username];
    socket.emit("stream", player.log.join("\n"));
    if (player.p2) player.flipClient();
    player.rejoin();
  })

  socket.on("pick", (user: User) => {
    let opp = queue.pop();
    // if (opp) {
    // const battle = new Battle({ p1: user, p2: opp });
    // battles[user.name] = battle;
    // battles[opp.name] = battle;

    // new Player(battle.streams.p1, socket).start();
    // new Player(battle.streams.p2, userSockets[opp.name]).start();
    // } else {
    //   queue.push(user);
    // }
    if (opp == undefined) {
      queue.push(user);
      return;
    }

    const p1spec = { name: user.name, team: Teams.pack(user.team) };
    const p2spec = { name: opp.name, team: Teams.pack(opp.team) };

    const batStream = new BattleStreams.BattleStream({ debug: true });
    const streams = BattleStreams.getPlayerStreams(batStream);

    const oppSocket = userSockets[opp.name];
    const p1 = new Player(streams.p1, socket);
    const p2 = new Player(streams.p2, oppSocket, true);

    userPlayers[user.name] = p1;
    userPlayers[opp.name] = p2;

    oppSocket.emit("flip");

    p1.start();
    p2.start();

    (async () => {
      for await (const output of streams.omniscient) {
        socket.emit("stream", output);
        oppSocket.emit("stream", output);
      }
    })();

    streams.omniscient.write(`>start {"formatid":"gen7randombattle"}`);
    streams.omniscient.write(`>player p1 ${JSON.stringify(p1spec)}`);
    streams.omniscient.write(`>player p2 ${JSON.stringify(p2spec)}`);
  });
});

server.listen(5000, () => {
  console.log("UP");
});
