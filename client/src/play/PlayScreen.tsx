import { Battle, Pokemon, Side } from "@pkmn/client";
import { Generations, Moves, Move } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { Args, Protocol, Handler, Username } from "@pkmn/protocol";
import { Icons, Sprites, PokemonSprite } from "@pkmn/img";
import { SocketContext } from "context/socket";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import StatBar from "./StatBar";
import PartyPokemon from "./PartyPokemon";
import { ListPoke } from "./listPoke";
import Weather from "./Weather";
import Backdrop from "./Backdrop";
import Sidebar from "./Sidebar";
import MoveButton, { MoveSummary } from "./MoveButton";
import { useAppSelector } from "app/hooks";

const Outer = styled.div`
  position: absolute;
  text-align: left;
  top: 9px;
  left: -1px;
  border: 1px solid #aaa;
  background: #cfd5da;
  color: #000;
  width: 640px;
  height: 360px;
  overflow: hidden;
  font-family: Verdana, sans-serif;
  font-size: 10pt;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  top: 0;
  left: 0;
  transform-origin: top left;
  -webkit-transform-origin: top left;
  // transform: none;
`;
const Inner = styled.div`
  position: relative;
  width: 640px;
  height: 360px;
`;

interface ImageProp {
  sprite: PokemonSprite;
  name: string;
  fainted: boolean;
  top: number;
  left: number;
}

const SpriteImage = styled.img.attrs<ImageProp>(({ sprite, name }) => ({
  src: sprite.url,
  "data-name": name,
  alt: name,
}))<ImageProp>`
  position: absolute;
  top: ${(p) => p.top - Math.round(p.sprite.h / 2)}px;
  left: ${(p) => p.left - Math.round(p.sprite.w / 2)}px;
  width: ${(p) => p.sprite.w}px;
  height: ${(p) => p.sprite.h}px;
  ${(props) =>
    props.fainted
      ? `
  opacity: 0.3
  filter: grayscale(100%) brightness(.5)
  `
      : ""}
`;

class ClientHandler implements Handler<void> {
  private setWin;
  constructor(
    setWin: React.Dispatch<React.SetStateAction<Username | undefined>>
  ) {
    this.setWin = setWin;
  }
  "|win|"(args: Args["|win|"]) {
    this.setWin(args[1]);
  }
}

const Controls = styled.div`
  position: absolute;
  top: 370px;
  left: 0;
  width: 640px;
  // background: #eef2f5;
`;

const Turn = styled.div`
  position: absolute;
  display: block;
  top: 10px;
  left: 110px;
  font-size: 13pt;
  font-weight: 700;
  margin: 0;
  padding: 2px 8px;
  border: 2px solid #320;
  border-radius: 6px;
  color: #320;
  background: #fcfaf2;
  opacity: 0.4;
  left: 110px;
`;

const addPokemon = (pokemon: Pokemon | null, sideID: "p1" | "p2") => {
  if (pokemon) {
    const sprite = Sprites.getPokemon(pokemon.speciesForme, {
      gen: "ani",
      gender: pokemon.gender || undefined,
      shiny: pokemon.shiny,
      side: sideID,
    });

    return (
      <SpriteImage
        sprite={sprite as PokemonSprite}
        name={pokemon.name}
        fainted={pokemon.fainted}
        top={sideID === "p1" ? 245 : 130}
        left={sideID === "p1" ? 210 : 430}
      />
    );
  }
  return null;
};

const hpPercent = (condition: string) => {
  if (condition.endsWith(" fnt")) return 0;
  let [hp, base] = condition.split("/").map((v) => parseInt(v));
  return hp / base;
};

const generations = new Generations(Dex);
const dexMoves = generations.get(7).moves;

function Screen({ p1, p2 }: { p1: Side; p2: Side }) {
  return (
    <>
      <div>
        <div>{p2.active.map((active) => addPokemon(active, "p2"))}</div>
        <div>{p1.active.map((active) => addPokemon(active, "p1"))}</div>
      </div>
      <div>
        {p1.active.map((active) =>
          active ? <StatBar pokemon={active} left={130} top={120} /> : null
        )}
        {p2.active.map((active) =>
          active ? <StatBar pokemon={active} left={350} top={24} /> : null
        )}
      </div>
    </>
  );
}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function PlayScreen() {
  const socket = useContext(SocketContext);
  const [moves, setMoves] = useState<MoveSummary[]>([]);
  const [side, setSide] = useState<ListPoke[]>();
  const [moveLock, setMoveLock] = useState(true);
  const [switchLock, setSwitchLock] = useState(true);
  const [selMove, setSelMove] = useState(0);
  const [selPoke, setSelPoke] = useState(1);

  const [battle, setBattle] = useState(new Battle(generations));
  const [win, setWin] = useState<Username>();
  const [handler] = useState(new ClientHandler(setWin));

  const [flip, setFlip] = useState(false);
  const forceUpdate = useForceUpdate();
  const query = useQuery();
  let username = useAppSelector((state) => state.user.username);

  useEffect(() => {
    if (query.has("rejoin") && username) {
      socket.emit("rejoin-battle", username);
    }
  }, [socket]);

  useEffect(() => {
    if (selMove > 0) {
      socket.emit("response", `move ${selMove}`);
    } else if (selMove < 0) {
      socket.emit("cancel");
    }
    setSelMove(0);
  }, [selMove, socket]);

  useEffect(() => {
    if (selPoke > 1) {
      socket.emit("response", `switch ${selPoke}`);
    }
    setSelPoke(1);
  }, [selPoke, socket, side]);

  useEffect(() => {
    socket.on("request", (request) => {
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
    socket.on("stream", (output) => {
      let newBattle = battle;
      for (const line of output.split("\n")) {
        console.log(line);
        const { args, kwArgs } = Protocol.parseBattleLine(line);
        newBattle.add(args, kwArgs);
        const key = Protocol.key(args);
        if (key && key in handler) (handler as any)[key](args, kwArgs);
      }
      newBattle.update();

      forceUpdate();
    });
    socket.on("flip", () => {
      setFlip(true);
    });
    return () => {
      socket.off("request");
      socket.off("wait");
      socket.off("stream");
      socket.off("flip");
    };
  }, [socket]);

  return (
    <div>
      <Outer>
        <Inner>
          <Backdrop />
          <Weather type={battle.field.weather} />
          <Screen
            p1={flip ? battle.p2 : battle.p1}
            p2={flip ? battle.p1 : battle.p2}
          />
          <Sidebar player={battle.p1} right={flip} />
          <Sidebar player={battle.p2} right={!flip} />
          <Turn>Turn {battle.turn}</Turn>
        </Inner>
      </Outer>
      <Controls>
        <div>
          {moveLock
            ? null
            : moves.map((move, index) => {
                let dexMove = dexMoves.get(move.move);
                // console.log(dexMove);
                return (
                  <MoveButton
                    dexMove={dexMove}
                    requestMove={move}
                    onClick={() => {
                      console.log("clicked", index + 1);

                      setSelMove(index + 1);
                    }}
                  />
                );
              })}
        </div>
        <div>
          {switchLock
            ? null
            : side?.map((poke, index) => (
                <PartyPokemon
                  poke={poke}
                  active={index === 0}
                  onClick={() => setSelPoke(index + 1)}
                  hpPercent={hpPercent(poke.condition)}
                />
              ))}
        </div>
        {moveLock && switchLock && !win ? "Waiting" : null}
        {win ? `${win} has won the battle!` : null}
      </Controls>
    </div>
  );
}

export default PlayScreen;
