import { ListPoke } from "./listPoke";
import { Icons } from "@pkmn/img";
import { useEffect, useState } from "react";
import styled from "styled-components";

const HPBar = styled.span<{ width: number }>`
  position: absolute;
  display: block;
  border: 1px solid #aaa;
  background: #eee;
  height: 2px;
  bottom: 2px;
  left: 4px;
  right: 2px;
  border-radius: 2px;
  opacity: 0.8;

  span {
    display: block;
    height: 1px;
    background: #0a6;
    border-top: 1px solid #3c0;
    border-radius: 1px;
    width: ${(p) => p.width}px;
  }
`;

const Wrapper = styled.button`
  display: block;
  float: left;
  width: 102px;
  min-height: 30px;
  margin-right: 4px;
  font: 9pt Verdana, sans-serif;
  padding: 5px 5px 5px 0;
  white-space: pre;
  overflow: hidden;
  position: relative;
  outline: none;
  text-align: center;
  text-decoration: none;
  text-shadow: 0 1px 0 rgb(255 255 255 / 40%);
  border-radius: 5px;
  margin-top: 4px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 20%), inset 0 -1px 2px #fff;
  color: #000;
  border: solid 1px #aaa;
  background: #e3e3e3;
  background: linear-gradient(to bottom, #f6f6f6, #e3e3e3);
  ${(p) =>
    p.disabled
      ? `
  cursor: default;
  background: #f3f3f3!important;
  border-color: #ccc!important;
  -webkit-box-shadow: none!important;
  -moz-box-shadow: none!important;
  box-shadow: none!important;
  color: #777!important;`
      : ""}
`;

const PIcon = styled.span`
  display: inline-block;
  width: 40px;
  height: 30px;
  float: left;
  margin: -6px -3px -6px -4px;
  opacity: 0.8;
  image-rendering: pixelated;
`;

interface IProps {
  poke: ListPoke;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  hpPercent: number;
}
function PartyPokemon({ poke, active, onClick, hpPercent }: IProps) {
  const [iconCSS, setIconCSS] = useState<{ [attr: string]: string }>({});
  useEffect(() => {
    let name = poke.details.split(",")[0];
    setIconCSS(Icons.getPokemon(name)?.css);
  }, [poke]);
  return (
    <Wrapper
      disabled={poke.condition.endsWith(" fnt") || active}
      onClick={poke.condition.endsWith(" fnt") || active ? undefined : onClick}
    >
      <PIcon style={iconCSS} /> {poke.details.split(",")[0]}
      <HPBar width={Math.round(hpPercent * 92)}>
        <span />
      </HPBar>
    </Wrapper>
  );
}
export default PartyPokemon;
