import { Router } from "express";
import { commandOptions, createClient } from "redis";
import { User, validate } from "./user";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

routes.post("/join", async (req, res) => {
  const user = req.body as User;
  if (!validate(user)) {
    res.status(500).send("Invalid");
  }
  const winCount = (await redisClient.hGet("wins", `${user.id}`)) || "0";
  await redisClient.lPush(`user:${winCount}`, JSON.stringify(req.body));
  const subscriber = redisClient.duplicate();
  await subscriber.connect();
  console.log("k");
  await subscriber.subscribe(`match:${user.id}`, (message) => {
    console.log(message);
    res.send(message);
    subscriber.unsubscribe(`match:${user.id}`);
    subscriber.quit();
  });
});

export default routes;
