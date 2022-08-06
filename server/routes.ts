import { Router } from "express";
import proto from "./routes/proto";
import { BattleStreams, Teams, TeamValidator } from "@pkmn/sim";
import { PokemonSet } from "@pkmn/types";

const routes = Router();

routes.get("/", (req, res) => {
  console.log("HIT");
  return res.json({ message: "Hello World" });
});

routes.post("/pick", (req, res) => {
  console.log(req.body);
  return res.json({ message: "Hello World" });
});

export default routes;
