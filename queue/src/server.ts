import server from "./app";
import findMatch from "./worker";

server.listen(6000, () => {
  console.log("UP");
});

setInterval(findMatch, 10);
