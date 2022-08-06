import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function StartScreen() {
  return (
    <Wrapper>
      <Link to="/pick">
        <button>Start!</button>
      </Link>
    </Wrapper>
  );
}

export default StartScreen;
