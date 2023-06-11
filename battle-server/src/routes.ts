import { Router } from "express";
import { AnyObject, BattleStreams } from "@pkmn/sim";
import { PokemonSet } from "@pkmn/types";
import { Server, Socket } from "socket.io";
import { Battle, validateBattleInfo } from "./battle";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

routes.post("/new", (req, res) => {
  const info = req.body;
  if (!validateBattleInfo(info))
    return res.status(400).send("Invalid battle info");
  const battle = new Battle(req.body);
});

export default routes;
