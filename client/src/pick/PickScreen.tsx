import styled from "styled-components";
import TeamPicker from "pick/TeamPicker";
import { useEffect } from "react";
import { confirm } from "./pickSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  text-align: center;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function PickScreen() {
  let isReady = useAppSelector((state) => state.pick.ready);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isReady) {
      navigate("/play", { replace: true });
    }
  }, [isReady, navigate]);
  return (
    <Wrapper>
      <TeamPicker />
      <button onClick={() => dispatch(confirm())}>Confirm</button>
    </Wrapper>
  );
}

export default PickScreen;
