import styled from "styled-components";
import TeamPicker from "pick/TeamPicker";
import { useEffect, useRef, useState } from "react";
import { ready } from "./pickSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";

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
  useEffect(() => {
    if (isReady) {
      console.log("MOVING");
    }
  }, [isReady]);
  return (
    <Wrapper>
      <TeamPicker />
      <button onClick={() => dispatch(ready())}>Confirm</button>
    </Wrapper>
  );
}

export default PickScreen;
