import { Battle, Pokemon } from "@pkmn/client";
import { Generations, SideID, StatusName } from "@pkmn/data";
import { Dex } from "@pkmn/dex";
import { Args, Protocol, Handler, Username } from "@pkmn/protocol";
import { Icons, Sprites, PokemonSprite } from "@pkmn/img";
import { Move } from "@pkmn/sim";
import { SocketContext } from "context/socket";
import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Effect from "./Effects";

const Wrapper = styled.div`
  position: absolute;
  width: 154px;
  min-height: 40px;
  padding: 2px 4px;
  font-family: Verdana, sans-serif;
  font-size: 10pt;
  color: #000;
`;
const Details = styled.strong`
  margin: 0 -15px;
  display: block;
  text-align: center;
  color: #222;
  text-shadow: #fff 1px 1px 0, #fff 1px -1px 0, #fff -1px 1px 0,
    #fff -1px -1px 0;

  small {
    font-weight: 400;
  }
`;
const HPText = styled.div`
  position: absolute;
  background: #777;
  color: #eee;
  text-shadow: #000 0 1px 0;
  font-size: 9px;
  width: 32px;
  height: 12px;
  top: -1px;
  text-align: center;
  right: -32px;
  border-radius: 0 4px 4px 0;
`;
const HP = styled.div<{ width: number }>`
  height: 4px;
  border-top: 2px solid #00dd60;
  background: #00bb51;
  border-bottom: 2px solid #007734;
  border-right: 1px solid #007734;
  border-radius: 3px;
  width: ${(props) => props.width}px;
  border-right-width: 1px;
`;
const HPBar = styled.div`
  position: relative;
  border: 1px solid #777;
  background: #fcfeff;
  padding: 1px;
  height: 8px;
  margin: 0;
  width: 151px;
  border-radius: 4px;
`;

const PrevHP = styled.div`
  background: #bec;
  height: 8px;
  border-radius: 3px;
  width: 151px;
`;

const Status = styled.div`
  color: #fff;
  border-radius: 3px;
  padding: 0 2px;
  min-height: 10px;
  font-size: 7pt;
`;

interface IProp {
  pokemon: Pokemon;
  top: number;
  left: number;
}

function StatBar({ pokemon, top, left }: IProp) {
  useEffect(() => {
    console.log(pokemon);
  }, [pokemon]);
  return (
    <Wrapper style={{ top: `${top}px`, left: `${left}px` }}>
      <Details>
        {pokemon.name}
        <img
          src={`https://play.pokemonshowdown.com/fx/gender-${pokemon.gender.toLowerCase()}.png`}
          alt={pokemon.gender}
          width="7"
          height="10"
          className="pixelated"
        ></img>
        <small>L{pokemon.level}</small>
      </Details>
      <HPBar>
        <HPText>{Math.round((pokemon.hp / pokemon.baseMaxhp) * 100)}%</HPText>
        <PrevHP>
          <HP width={Math.round((pokemon.hp / pokemon.baseMaxhp) * 150)} />
        </PrevHP>
        <Status>
          {pokemon.status ? (
            <Effect type="status" val={pokemon.status} />
          ) : null}
          {Object.entries(pokemon.boosts).map(([name, value]) => (
            <Effect type="boost" val={{ boost: name, val: value }} />
          ))}
          {Object.entries(pokemon.volatiles).map(([name, value]) => (
            <Effect type="other" val={name} />
          ))}
        </Status>
      </HPBar>
    </Wrapper>
  );
}

export default StatBar;
