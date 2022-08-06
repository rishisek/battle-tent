import styled from "styled-components";
import { MouseEventHandler } from "react";
import { PokemonSet } from "@pkmn/sets";

interface BoxProps {
  selected: boolean;
}
const Wrapper = styled.div<BoxProps>`
  display: flex;
  flex-direction: column;
  font-size: 0.5em;
  width: 20em;
  padding: 1em;
  border: ${(props) => (props.selected ? "1px solid white" : "none")};
`;

const Name = styled.h1`
  font-size: 1.25em;
  width: fit-content;
  margin: 0;
`;
const Subrow = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Moves = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;
const Move = styled.p`
  display: flex;
  flex-basis: calc(50% - 40px);
  justify-content: center;
  flex-direction: column;
  margin: 10px 20px 0;
`;
const Label = styled.p`
  margin: 0;
`;
const PokemonInfo = ({ pokeSet, onClick, selected }: IProps) => {
  return (
    <Wrapper onClick={onClick} selected={selected}>
      <Name>{pokeSet.name}</Name>
      <Subrow>
        <Label>Item: {pokeSet.item}</Label>
        <Label>Ability: {pokeSet.ability}</Label>
      </Subrow>
      <Moves>
        {pokeSet.moves.map((move) => (
          <Move>{move}</Move>
        ))}
      </Moves>
    </Wrapper>
  );
};

interface IProps {
  pokeSet: PokemonSet;
  onClick: MouseEventHandler<HTMLElement>;
  selected: boolean;
}

export default PokemonInfo;
