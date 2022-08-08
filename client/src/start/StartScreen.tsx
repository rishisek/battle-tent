import { SocketContext } from "context/socket";
import { useContext, useEffect } from "react";
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
  const socket = useContext(SocketContext);
  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID, username: "username" };
      socket.connect();
    } else {
      socket.auth = { username: "username" };
      socket.connect();
    }
    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });
    return () => {
      socket.off("session");
    };
  }, [socket]);
  return (
    <Wrapper>
      <Link to="/pick">
        <button>Start!</button>
      </Link>
    </Wrapper>
  );
}

export default StartScreen;
