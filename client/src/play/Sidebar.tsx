import { Side } from "@pkmn/client";
import { Sprites } from "@pkmn/img";
import styled from "styled-components";
import PokeIcon from "./PokeIcon";

const Wrapper = styled.div<{ right: boolean }>`
  position: absolute;
  top: 0;
  height: 450px;
  width: 100px;
  background-color: #ccc;
  background-color: rgba(255,255,255,.5);
  border-right: 1px solid rgba(215,215,215,.5);
  color: #777;
  ${(p) => (p.right ? "right: 0;" : "left: 0;")}
}`;

const Trainer = styled.div<{ right: boolean }>`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${(p) => (p.right ? 232 : 75)}px;
`;

const Username = styled.strong`
  display: block;
  font-size: 8pt;
  margin-bottom: 2px;
  word-wrap: break-word;
`;

const TrainerSprite = styled.div<{ avatarURL: string; right: boolean }>`
  width: 86px;
  height: 90px;
  opacity: 0.8;
  max-width: 80px;
  max-height: 80px;
  image-rendering: pixelated;
  background-image: url(${(p) => p.avatarURL});
  margin: 0 auto;

  ${(p) => (p.right ? "" : "transform: scaleX(-1);")}
`;

const TeamIcons = styled.div`
  opacity: 0.8;
  background: transparent none no-repeat scroll center top;
  width: 100px;
  height: 30px;
  margin: 0 0 0 2px;
`;

const StyledIcon = styled(PokeIcon)`
  float: left;
  margin: 0 -4px;
`;

function Sidebar({ player, right = false }: { player: Side; right?: boolean }) {
  return (
    <Wrapper right={right}>
      <Trainer right={right}>
        <Username>{player.name}</Username>
        <TrainerSprite
          avatarURL={Sprites.getAvatar(player.avatar)}
          right={right}
        />
        <TeamIcons>
          {player.team.map((poke) => (
            <StyledIcon name={poke.name} fainted={poke.fainted} />
          ))}
          {Array.from(
            { length: player.totalPokemon - player.team.length },
            () => (
              <StyledIcon name="pokeball" pokeball={true} />
            )
          )}
        </TeamIcons>
        <TeamIcons />
        <TeamIcons />
      </Trainer>
    </Wrapper>
  );
}

export default Sidebar;
