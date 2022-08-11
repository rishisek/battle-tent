import { Icons } from "@pkmn/img";
import styled from "styled-components";

const Wrapper = styled.span<{ fainted: boolean }>`
  display: inline-block;
  width: 40px;
  height: 30px;

  image-rendering: pixelated;
  ${(p) =>
    p.fainted
      ? `
    opacity: .3;filter: 
    grayscale(100%) brightness(.5);`
      : ""}
`;

function PokeIcon({
  name,
  fainted = false,
  pokeball = false,
  className,
}: {
  name: string;
  fainted?: boolean;
  pokeball?: boolean;
  className?: string;
}) {
  return (
    <Wrapper
      fainted={fainted}
      style={
        pokeball ? Icons.getPokeball(name)?.css : Icons.getPokemon(name)?.css
      }
      className={className}
    />
  );
}

export default PokeIcon;
