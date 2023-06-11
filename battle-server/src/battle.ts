import { AnyObject, BattleStreams, PokemonSet, Teams } from "@pkmn/sim";
import { ObjectReadWriteStream } from "@pkmn/streams";
import { Socket } from "socket.io";

export interface BattleInfo {
  p1: User;
  p2: User;
}

export interface User {
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

export class Player extends BattleStreams.BattlePlayer {
  private socket;
  private lastRequest: AnyObject;
  public p2;

  constructor(playerStream: ObjectReadWriteStream<string>, socket: Socket, p2: boolean = false) {
    super(playerStream, false);
    this.socket = socket;
    this.lastRequest = {};
    this.p2 = p2;
  }

  setSocket(newSocket: Socket){
    this.socket = newSocket;
  }

  receiveRequest(request: AnyObject) {
    this.lastRequest = request;
    if (request.wait) {
      this.socket.emit("wait");
      return;
    }
    this.socket.emit("request", request);
    this.socket.on("response", response => this.handleResponse(response));
  }

  private handleResponse(response: string) {
      try {
        this.choose(response);
      } catch (err) {
        console.log(err);
      }
      this.socket.removeAllListeners("response");
      this.socket.emit("wait");
    }

  rejoin() {
    this.receiveRequest(this.lastRequest);
  }

  flipClient(){
    this.socket.emit("flip");
  }
}
