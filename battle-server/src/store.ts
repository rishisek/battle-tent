import { Battle } from "./battle";

class Store {
  readonly battles: Map<string, Battle>;
  constructor() {
    this.battles = new Map();
  }
  addBattle(id: string, battle: Battle) {
    this.battles.set(id, battle);
  }
}

export default new Store();
