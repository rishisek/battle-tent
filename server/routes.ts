import { Router } from "express";
import {
  AnyObject,
  BattleStreams,
  PRNG,
  PRNGSeed,
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
    socket.on("pick", (team) => {
      if (new TeamValidator("gen7").validateTeam(team)) {
        socket.emit("bad_pick", team);
      }
      myTeam = team;
      start(socket);
    });
  });

  async function start(socket: Socket) {
    const p1spec = { name: "P1", team: Teams.pack(myTeam) };
    const p2spec = { name: "P2", team: Teams.pack(otherTeam) };

    const streams = BattleStreams.getPlayerStreams(
      new BattleStreams.BattleStream({ debug: true })
    );

    const p1 = new Player(p1spec.name, streams.p1, socket);
    const p2 = new RandomPlayerAI(streams.p2, {}, true);

    p1.start();
    p2.start();

    (async () => {
      for await (const output of streams.omniscient) {
        console.log(output);
      }
    })();

    streams.omniscient.write(`>start {"formatid":"gen7randombattle"}`);
    streams.omniscient.write(`>player p1 ${JSON.stringify(p1spec)}`);
    streams.omniscient.write(`>player p2 ${JSON.stringify(p2spec)}`);
  }
}
