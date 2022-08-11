import { Move, TypeName } from "@pkmn/data";
import styled from "styled-components";

interface CSSProps {
  default: { background: string; gradient: string; borderColor: string };
  hover: { background: string; gradient: string; borderColor: string };
  active: { background: string; gradient: string; borderColor: string };
  small: string;
}
const Wrapper = styled.button<CSSProps>`
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
  float: left;
  display: block;
  width: 155px;
  margin-right: 4px;
  height: 40px;
  font: 10pt/100% Verdana, sans-serif;
  padding: 6px 4px 0;

  background: ${(p) => p.default.background};
  background: ${(p) => p.default.gradient};
  border-color: ${(p) => p.default.borderColor};
  &:hover {
    background: ${(p) => p.hover.background};
    background: ${(p) => p.hover.gradient};
    border-color: ${(p) => p.hover.borderColor};
  }
  &:active {
    background: ${(p) => p.active.background};
    background: ${(p) => p.active.gradient};
    border-color: ${(p) => p.active.borderColor};
  }
  small {
    color: ${(p) => p.small};
  }
`;

const Type = styled.small`
  padding-top: 3px;
  float: left;
  font-size: 8pt;
  color: #777;
`;

const PP = styled.small`
  padding-top: 2px;
  float: right;
  font-size: 8pt;
  color: #777;
`;

export interface MoveSummary {
  move: string;
  pp: number;
  maxpp: number;
  disabled: boolean;
}

function MoveButton({
  dexMove,
  requestMove,
  onClick,
}: {
  dexMove: Move | undefined;
  requestMove: MoveSummary;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  if (!dexMove) return null;
  return (
    <Wrapper
      {...typeToCol[dexMove.type]}
      onClick={requestMove.disabled ? undefined : onClick}
    >
      {dexMove.realMove || dexMove.name}
      <br />
      <Type>{dexMove.type}</Type>
      <PP>
        {requestMove.pp}/{requestMove.maxpp}
      </PP>
      &nbsp;
    </Wrapper>
  );
}

export default MoveButton;

const typeToCol: {
  [t in TypeName]: CSSProps;
} = {
  Normal: {
    default: {
      background: "#f0f0eb",
      gradient:
        "linear-gradient(to bottom, hsl(60, 14%, 97%), hsl(60, 14%, 84%))",
      borderColor: "#bdbda8",
    },
    small: "#77775a",
    hover: {
      background: "#e2e2d9",
      gradient:
        "linear-gradient(to bottom, hsl(60, 14%, 94%), hsl(60, 14%, 77%))",
      borderColor: "#77775a",
    },
    active: {
      background: "#cdcdbc",
      gradient:
        "linear-gradient(to bottom, hsl(60, 14%, 77%), hsl(60, 14%, 83%))",
      borderColor: "#77775a",
    },
  },
  Fighting: {
    default: {
      background: "#f4e7e6",
      gradient:
        "linear-gradient(to bottom, hsl(3, 40%, 97%), hsl(3, 40%, 84%))",
      borderColor: "#d19794",
    },
    small: "#92433f",
    hover: {
      background: "#e3d9dc",
      gradient:
        "linear-gradient(to bottom, hsl(3, 40%, 94%), hsl(3, 40%, 77%))",
      borderColor: "#92433f",
    },
    active: {
      background: "#cebbc1",
      gradient:
        "linear-gradient(to bottom, hsl(3, 40%, 77%), hsl(3, 40%, 83%))",
      borderColor: "#92433f",
    },
  },
  Flying: {
    default: {
      background: "#ebeaf1",
      gradient:
        "linear-gradient(to bottom, hsl(255, 20%, 97%), hsl(255, 20%, 84%))",
      borderColor: "#aba3c2",
    },
    small: "#5e547d",
    hover: {
      background: "#dbd7e4",
      gradient:
        "linear-gradient(to bottom, hsl(255, 20%, 94%), hsl(255, 20%, 77%))",
      borderColor: "#5e547d",
    },
    active: {
      background: "#beb9d0",
      gradient:
        "linear-gradient(to bottom, hsl(255, 20%, 77%), hsl(255, 20%, 83%))",
      borderColor: "#5e547d",
    },
  },
  Poison: {
    default: {
      background: "#f3e8f3",
      gradient:
        "linear-gradient(to bottom, hsl(300, 30%, 97%), hsl(300, 30%, 84%))",
      borderColor: "#c99cc9",
    },
    small: "#884988",
    hover: {
      background: "#e8d4e8",
      gradient:
        "linear-gradient(to bottom, hsl(300, 30%, 94%), hsl(300, 30%, 77%))",
      borderColor: "#884988",
    },
    active: {
      background: "#d6b3d6",
      gradient:
        "linear-gradient(to bottom, hsl(300, 30%, 77%), hsl(300, 30%, 83%))",
      borderColor: "#884988",
    },
  },
  Ground: {
    default: {
      background: "#f2efe8",
      gradient:
        "linear-gradient(to bottom, hsl(44, 27%, 97%), hsl(44, 27%, 84%))",
      borderColor: "#c7bc9e",
    },
    small: "#85764c",
    hover: {
      background: "#e7e2d5",
      gradient:
        "linear-gradient(to bottom, hsl(44, 27%, 94%), hsl(44, 27%, 77%))",
      borderColor: "#85764c",
    },
    active: {
      background: "#d4ccb5",
      gradient:
        "linear-gradient(to bottom, hsl(44, 27%, 77%), hsl(44, 27%, 83%))",
      borderColor: "#85764c",
    },
  },
  Rock: {
    default: {
      background: "#f3f1e7",
      gradient:
        "linear-gradient(to bottom, hsl(49, 35%, 97%), hsl(49, 35%, 84%))",
      borderColor: "#cdc398",
    },
    small: "#8d8044",
    hover: {
      background: "#e9e5d2",
      gradient:
        "linear-gradient(to bottom, hsl(49, 35%, 94%), hsl(49, 35%, 77%))",
      borderColor: "#8d8044",
    },
    active: {
      background: "#d9d1b0",
      gradient:
        "linear-gradient(to bottom, hsl(49, 35%, 77%), hsl(49, 35%, 83%))",
      borderColor: "#8d8044",
    },
  },
  Bug: {
    default: {
      background: "#f3f5e6",
      gradient:
        "linear-gradient(to bottom, hsl(66, 42%, 97%), hsl(66, 42%, 84%))",
      borderColor: "#ccd392",
    },
    small: "#8c943d",
    hover: {
      background: "#e9ecd0",
      gradient:
        "linear-gradient(to bottom, hsl(66, 42%, 94%), hsl(66, 42%, 77%))",
      borderColor: "#8c943d",
    },
    active: {
      background: "#d8ddac",
      gradient:
        "linear-gradient(to bottom, hsl(66, 42%, 77%), hsl(66, 42%, 83%))",
      borderColor: "#8c943d",
    },
  },
  Ghost: {
    default: {
      background: "#ece9f1",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 97%), hsl(262, 21%, 84%))",
      borderColor: "#aea2c3",
    },
    small: "#63537f",
    hover: {
      background: "#dcd7e5",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 94%), hsl(262, 21%, 77%))",
      borderColor: "#63537f",
    },
    active: {
      background: "#c1b8d1",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 77%), hsl(262, 21%, 83%))",
      borderColor: "#63537f",
    },
  },
  Steel: {
    default: {
      background: "#ececee",
      gradient:
        "linear-gradient(to bottom, hsl(240, 6%, 97%), hsl(240, 6%, 84%))",
      borderColor: "#aeaeb7",
    },
    small: "#62626f",
    hover: {
      background: "#dcdce0",
      gradient:
        "linear-gradient(to bottom, hsl(240, 6%, 94%), hsl(240, 6%, 77%))",
      borderColor: "#62626f",
    },
    active: {
      background: "#c1c1c8",
      gradient:
        "linear-gradient(to bottom, hsl(240, 6%, 77%), hsl(240, 6%, 83%))",
      borderColor: "#62626f",
    },
  },
  Fire: {
    default: {
      background: "#f4ece6",
      gradient:
        "linear-gradient(to bottom, hsl(25, 40%, 97%), hsl(25, 40%, 84%))",
      borderColor: "#d1ad94",
    },
    small: "#92623f",
    hover: {
      background: "#ebdcd1",
      gradient:
        "linear-gradient(to bottom, hsl(25, 40%, 94%), hsl(25, 40%, 77%))",
      borderColor: "#92623f",
    },
    active: {
      background: "#dcc0ad",
      gradient:
        "linear-gradient(to bottom, hsl(25, 40%, 77%), hsl(25, 40%, 83%))",
      borderColor: "#92623f",
    },
  },
  Water: {
    default: {
      background: "#e8ebf2",
      gradient:
        "linear-gradient(to bottom, hsl(222, 29%, 97%), hsl(222, 29%, 84%))",
      borderColor: "#9caac9",
    },
    small: "#4a5c87",
    hover: {
      background: "#d4dae7",
      gradient:
        "linear-gradient(to bottom, hsl(222, 29%, 94%), hsl(222, 29%, 77%))",
      borderColor: "#4a5c87",
    },
    active: {
      background: "#b3bed5",
      gradient:
        "linear-gradient(to bottom, hsl(222, 29%, 77%), hsl(222, 29%, 83%))",
      borderColor: "#4a5c87",
    },
  },
  Grass: {
    default: {
      background: "#ebf3e8",
      gradient:
        "linear-gradient(to bottom, hsl(100, 30%, 97%), hsl(100, 30%, 84%))",
      borderColor: "#abc99c",
    },
    small: "#5e8849",
    hover: {
      background: "#dbe8d4",
      gradient:
        "linear-gradient(to bottom, hsl(100, 30%, 94%), hsl(100, 30%, 77%))",
      borderColor: "#5e8849",
    },
    active: {
      background: "#bed6b3",
      gradient:
        "linear-gradient(to bottom, hsl(100, 30%, 77%), hsl(100, 30%, 83%))",
      borderColor: "#5e8849",
    },
  },
  Electric: {
    default: {
      background: "#f4f2e6",
      gradient:
        "linear-gradient(to bottom, hsl(48, 41%, 97%), hsl(48, 41%, 84%))",
      borderColor: "#d2c593",
    },
    small: "#93823e",
    hover: {
      background: "#ebe6d0",
      gradient:
        "linear-gradient(to bottom, hsl(48, 41%, 94%), hsl(48, 41%, 77%))",
      borderColor: "#93823e",
    },
    active: {
      background: "#dcd3ac",
      gradient:
        "linear-gradient(to bottom, hsl(48, 41%, 77%), hsl(48, 41%, 83%))",
      borderColor: "#93823e",
    },
  },
  Psychic: {
    default: {
      background: "#f3e7eb",
      gradient:
        "linear-gradient(to bottom, hsl(342, 33%, 97%), hsl(342, 33%, 84%))",
      borderColor: "#cc99a8",
    },
    small: "#8b465b",
    hover: {
      background: "#e9d3d9",
      gradient:
        "linear-gradient(to bottom, hsl(342, 33%, 94%), hsl(342, 33%, 77%))",
      borderColor: "#8b465b",
    },
    active: {
      background: "#d8b1bd",
      gradient:
        "linear-gradient(to bottom, hsl(342, 33%, 77%), hsl(342, 33%, 83%))",
      borderColor: "#8b465b",
    },
  },
  Ice: {
    default: {
      background: "#eaf0f0",
      gradient:
        "linear-gradient(to bottom, hsl(180, 15%, 97%), hsl(180, 15%, 84%))",
      borderColor: "#a7bebe",
    },
    small: "#597878",
    hover: {
      background: "#d9e3e3",
      gradient:
        "linear-gradient(to bottom, hsl(180, 15%, 94%), hsl(180, 15%, 77%))",
      borderColor: "#597878",
    },
    active: {
      background: "#bccdcd",
      gradient:
        "linear-gradient(to bottom, hsl(180, 15%, 77%), hsl(180, 15%, 83%))",
      borderColor: "#597878",
    },
  },
  Dragon: {
    default: {
      background: "#eae6f4",
      gradient:
        "linear-gradient(to bottom, hsl(257, 39%, 97%), hsl(257, 39%, 84%))",
      borderColor: "#a695d0",
    },
    small: "#574091",
    hover: {
      background: "#d8d1eb",
      gradient:
        "linear-gradient(to bottom, hsl(257, 39%, 94%), hsl(257, 39%, 77%))",
      borderColor: "#574091",
    },
    active: {
      background: "#baaddb",
      gradient:
        "linear-gradient(to bottom, hsl(257, 39%, 77%), hsl(257, 39%, 83%))",
      borderColor: "#574091",
    },
  },
  Dark: {
    default: {
      background: "#f0edea",
      gradient:
        "linear-gradient(to bottom, hsl(24, 18%, 97%), hsl(24, 18%, 84%))",
      borderColor: "#c0b0a5",
    },
    small: "#7b6556",
    hover: {
      background: "#e4ddd8",
      gradient:
        "linear-gradient(to bottom, hsl(24, 18%, 94%), hsl(24, 18%, 77%))",
      borderColor: "#7b6556",
    },
    active: {
      background: "#cfc2ba",
      gradient:
        "linear-gradient(to bottom, hsl(24, 18%, 77%), hsl(24, 18%, 83%))",
      borderColor: "#7b6556",
    },
  },
  Fairy: {
    default: {
      background: "#f4e6f2",
      gradient:
        "linear-gradient(to bottom, hsl(310, 41%, 97%), hsl(310, 41%, 84%))",
      borderColor: "#d293c7",
    },
    small: "#933e85",
    hover: {
      background: "#ebd0e7",
      gradient:
        "linear-gradient(to bottom, hsl(310, 41%, 94%), hsl(310, 41%, 77%))",
      borderColor: "#933e85",
    },
    active: {
      background: "#dcacd4",
      gradient:
        "linear-gradient(to bottom, hsl(310, 41%, 77%), hsl(310, 41%, 83%))",
      borderColor: "#933e85",
    },
  },
  "???": {
    default: {
      background: "#ece9f1",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 97%), hsl(262, 21%, 84%))",
      borderColor: "#aea2c3",
    },
    small: "#63537f",
    hover: {
      background: "#dcd7e5",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 94%), hsl(262, 21%, 77%))",
      borderColor: "#63537f",
    },
    active: {
      background: "#c1b8d1",
      gradient:
        "linear-gradient(to bottom, hsl(262, 21%, 77%), hsl(262, 21%, 83%))",
      borderColor: "#63537f",
    },
  },
};
