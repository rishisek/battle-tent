import { AnyObject, BattleStreams, PokemonSet, Teams } from "@pkmn/sim";
import { ObjectReadWriteStream } from "@pkmn/streams";
import { model, Schema } from "mongoose";
import { Socket } from "socket.io";

export interface BattleInfo {
  p1: User;
  p2: User;
}

interface User {
  name: string;
  team: PokemonSet[];
}

export function validateBattleInfo(info: BattleInfo) {
  return true;
}

export class Battle {
  public streams;
  constructor(info: BattleInfo) {
    let batStream = new BattleStreams.BattleStream({ debug: false });
    this.streams = BattleStreams.getPlayerStreams(batStream);
    this.streams.omniscient.write(`>start {"formatid":"gen7randombattle"}`);
    this.streams.omniscient.write(
      `>p1 ${info.p1.name} ${JSON.stringify(Teams.pack(info.p1.team))}`
    );
    this.streams.omniscient.write(
      `>p2 ${info.p2.name} ${JSON.stringify(Teams.pack(info.p2.team))}`
    );
  }
}

const BattleSchema = new Schema<Battle>({});

export const BattleModel = model<Battle>("Battle", BattleSchema);

export class Player extends BattleStreams.BattlePlayer {
  private socket;
  constructor(playerStream: ObjectReadWriteStream<string>, socket: Socket) {
    super(playerStream, false);
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
