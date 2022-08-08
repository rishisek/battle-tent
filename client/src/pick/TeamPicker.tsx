import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Teams, TeamValidator } from "@pkmn/sim";
import { TeamGenerators } from "@pkmn/randoms";
import { PokemonSet } from "@pkmn/sets";
import PokemonInfo from "./PokemonInfo";
import { unready } from "./pickSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { SocketContext } from "context/socket";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PokeList = styled.div`
  text-align: center;
  background-color: grey;
  display: flex;
  flex-direction: column;
  color: white;
`;

function TeamPicker() {
  let [pokeSets, setPokeSets] = useState<PokemonSet[]>([]);
  let ready = useAppSelector((state) => state.pick.ready);
  let [selecteds, setSelecteds] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  let [selCount, setSelCount] = useState(0);

  const dispatch = useAppDispatch();

  const socket = useContext(SocketContext);

  useEffect(() => {
    Teams.setGeneratorFactory(TeamGenerators);
    setPokeSets(Teams.generate("gen7randombattle"));
  }, []);
  useEffect(() => {
    if (ready) {
      let team = pokeSets.filter((set, index) => selecteds[index]);
      if (team.length === 3) {
        socket.emit("pick", team, (status: number) => {
          if (status !== 200) dispatch(unready());
        });
      } else {
        dispatch(unready());
      }
    }
  }, [ready, pokeSets, selecteds, dispatch]);
  const select = (index: number) => {
    let selected = selecteds[index];
    if (!selected && selCount === 3) return;
    let newArr = [...selecteds];
    newArr[index] = !selected;
    setSelecteds(newArr);
    setSelCount(selCount + (newArr[index] ? 1 : -1));
  };
  return (
    <Wrapper>
      <PokeList>
        {pokeSets.map((pokeSet, index) => {
          return (
            <PokemonInfo
              pokeSet={pokeSet}
              onClick={() => select(index)}
              selected={selecteds[index]}
            />
          );
        })}
      </PokeList>
    </Wrapper>
  );
}

export default TeamPicker;
