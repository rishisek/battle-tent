import { Router } from "express";
import {
  AnyObject,
  BattleStreams,
  RandomPlayerAI,
  Teams,
  TeamValidator,
} from "@pkmn/sim";
import { PokemonSet } from "@pkmn/types";
import { ObjectReadWriteStream } from "@pkmn/streams";
import { Server, Socket } from "socket.io";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

export default routes;

class Player extends BattleStreams.BattlePlayer {
  private name;
  private socket;
  constructor(
    name: string,
    playerStream: ObjectReadWriteStream<string>,
    socket: Socket,
    debug = false
  ) {
    super(playerStream, debug);
    this.name = name;
    this.socket = socket;
  }

  receiveRequest(request: AnyObject) {
    if (request.wait) {
      this.socket.emit("wait");
      return;
    }
    this.socket.emit("request", request);
    this.socket.on("response", (response) => {
      try {
        this.choose(response);
      } catch (err) {
        console.log(err);
      }
      this.socket.removeAllListeners("response");
      this.socket.emit("wait");
    });
  }
}

interface BattleInfo {
  p1: User;
  p2: User;
}

interface User {
  name: string;
  team: PokemonSet[];
}

export function pick(io: Server) {
  let myTeam: PokemonSet[];
  let otherTeam: PokemonSet[] = [
    {
      name: "Skuntank",
      species: "Skuntank",
      gender: "",
      shiny: false,
      nature: "",
      gigantamax: false,
      level: 85,
      moves: ["toxic", "fireblast", "suckerpunch", "poisonjab"],
      ability: "Aftermath",
      evs: {
        hp: 85,
        atk: 85,
        def: 85,
        spa: 85,
        spd: 85,
        spe: 85,
      },
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31,
      },
      item: "Focus Sash",
    },
    {
      name: "Corviknight",
      species: "Corviknight",
      gender: "",
      shiny: false,
      nature: "",
      gigantamax: false,
      level: 78,
      moves: ["roost", "defog", "bravebird", "bodypress"],
      ability: "Mirror Armor",
      evs: {
        hp: 85,
        atk: 85,
        def: 85,
        spa: 85,
        spd: 85,
        spe: 85,
      },
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31,
      },
      item: "Leftovers",
    },
    {
      name: "Tauros",
      species: "Tauros",
      gender: "M",
      shiny: false,
      nature: "",
      gigantamax: false,
      level: 82,
      moves: ["closecombat", "throatchop", "zenheadbutt", "bodyslam"],
      ability: "Sheer Force",
      evs: {
        hp: 85,
        atk: 85,
        def: 85,
        spa: 85,
        spd: 85,
        spe: 85,
      },
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31,
      },
      item: "Life Orb",
    },
  ];
  io.on("connection", (socket) => {
    socket.on("start", (battleInfo) => {
      start(socket, battleInfo);
    });
  });

  async function start(socket: Socket, battleInfo: BattleInfo) {
    const batStream = new BattleStreams.BattleStream({ debug: true });
    const streams = BattleStreams.getPlayerStreams(batStream);

    const p1 = new Player(battleInfo.p1.name, streams.p1, socket);
    const p2 = new Player(battleInfo.p2.name, streams.p2, socket);

    p1.start();
    p2.start();

    (async () => {
      for await (const output of streams.omniscient) {
        socket.emit("stream", output);
      }
    })();

    streams.omniscient.write(`>start {"formatid":"gen7randombattle"}`);
    streams.omniscient.write(`>player p1 ${JSON.stringify(battleInfo.p1)}`);
    streams.omniscient.write(`>player p2 ${JSON.stringify(battleInfo.p2)}`);
  }
}
