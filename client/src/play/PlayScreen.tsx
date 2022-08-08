import { Move, Pokemon, Side } from "@pkmn/sim";
import { SocketContext } from "context/socket";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface MoveSummary {
  move: string;
  id: string;
  pp: number;
  maxpp: number;
  target: string;
  disabled: boolean;
}

interface ListPoke extends Pokemon {
  condition: string;
}

function PlayScreen() {
  const socket = useContext(SocketContext);
  const [moves, setMoves] = useState<MoveSummary[]>([]);
  const [side, setSide] = useState<ListPoke[]>();
  const [moveLock, setMoveLock] = useState(true);
  const [switchLock, setSwitchLock] = useState(true);
  const [selMove, setSelMove] = useState(0);
  const [selPoke, setSelPoke] = useState(1);

  useEffect(() => {
    if (selMove > 0) {
      socket.emit("response", `move ${selMove}`);
    } else if (selMove < 0) {
      socket.emit("cancel");
    }
    setSelMove(0);
  }, [selMove, socket]);

  useEffect(() => {
    if (selPoke > 1) socket.emit("response", `switch ${selPoke}`);
    setSelPoke(1);
  }, [selPoke, socket]);

  useEffect(() => {
    socket.on("request", (request) => {
      console.log(request);
      setSide(request.side.pokemon);
      setSwitchLock(false);
      if (!request.forceSwitch) {
        setMoves(request.active[0].moves);
        setMoveLock(false);
      }
    });
    socket.on("wait", () => {
      setMoveLock(true);
      setSwitchLock(true);
    });
    return () => {
      socket.off("request");
      socket.off("wait");
    };
  }, [socket]);

  return (
    <Wrapper>
      {moveLock
        ? "Waiting"
        : moves.map((move, index) => (
            <button onClick={() => setSelMove(index + 1)}>{move.move}</button>
          ))}
      {switchLock
        ? "Waiting"
        : side?.map((poke, index) => (
            <button
              onClick={
                index === 0 || poke.condition.endsWith(" fnt")
                  ? undefined
                  : () => setSelPoke(index + 1)
              }
            >
              {poke.details}
            </button>
          ))}
    </Wrapper>
  );
}

export default PlayScreen;
