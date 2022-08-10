import { BoostID, StatusName } from "@pkmn/data";
import styled from "styled-components";

const BaseEffect = styled.span`
  padding: 0 1px;
  border: 1px solid #f40;
  border-radius: 3px;
`;

const StatusEffect = styled(BaseEffect)<{ background: string }>`
  padding: 1px 2px;
  border: 0;
  border-radius: 3px;
  color: #fff;
  background: ${(p) => p.background};
`;

const statEffToCol: Record<string, string> = {
  brn: "#e53",
  psn: "#a4009a",
  tox: "#a4009a",
  par: "#9aa400",
  slp: "#a7a",
  frz: "#009aa4",
};

const GoodEffect = styled(BaseEffect)`
  background: #e5ffe0;
  color: #3a0;
  border-color: #3a0;
`;
const BadEffect = styled(BaseEffect)`
  background: #ffe5e0;
  color: #f40;
  border-color: #f40;
`;
const NeutralEffect = styled(BaseEffect)`
  background: #f0f0f0;
  color: #555;
  border-color: #555;
`;

interface IProps {
  type: "status" | "boost" | "other";
  val: { boost: string; val: number } | string;
}

function Effect({ type, val }: IProps) {
  if (type === "status" && typeof val === "string") {
    return (
      <StatusEffect
        background={
          Object.hasOwn(statEffToCol, val) ? statEffToCol[val] : "#000"
        }
      >
        {val.toUpperCase()}
      </StatusEffect>
    );
  }
  if (type === "boost" && typeof val !== "string") {
    if (val.val > 0)
      return (
        <GoodEffect>
          {val.val / 2}x {val.boost.toUpperCase()}
        </GoodEffect>
      );
    else
      return (
        <BadEffect>
          {(-2 / val.val).toFixed(2)}x {val.boost.toUpperCase()}
        </BadEffect>
      );
  }
  if (typeof val === "string") return <NeutralEffect>{val}</NeutralEffect>;
  return null;
}
export default Effect;
