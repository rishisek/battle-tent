import { createClient } from "redis";
import { User } from "./user";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

let winCount = "0";
let user: User | undefined = undefined;

async function getUser() {
  let user = await client.rPop(`user:${winCount}`);
  if (!user) {
    return undefined;
  }
  return JSON.parse(user) as User;
}

async function findMatch() {
  // if (!user){
  //  user = await client.rPop(`user:${winCount}`);
  // }
  // for (const user of await client.lRange(`user:${wFinCount}`, 0, 20)) {
  //     // use the key!
  // }
  let user = await getUser();
  let opp = await getUser();
  if (!user) {
    return;
  }
  console.log(user, opp);
  if (!opp) {
    await client.rPush(`user:${winCount}`, JSON.stringify(user));
    return;
  }

  let message = {
    p1: user,
    p2: opp,
    id: 0,
  };
  await client.publish(`match:${user.id}`, JSON.stringify(message));
  await client.publish(`match:${opp.id}`, JSON.stringify(message));
}
export default findMatch;
