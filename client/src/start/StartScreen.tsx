import { useAppDispatch } from "app/hooks";
import { SocketContext } from "context/socket";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setStateUsername } from "./userSlice";

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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  useEffect(() => {
    // const sessionID = localStorage.getItem("sessionID");
    // if (sessionID) {
    //   socket.auth = { sessionID, username: "username" };
    //   socket.connect();
    // } else {
    //   socket.auth = { username: "username" };
    socket.connect();
    // }
    // socket.on("session", ({ sessionID, userID }) => {
    //   // attach the session ID to the next reconnection attempts
    //   socket.auth = { sessionID };
    //   // store it in the localStorage
    //   localStorage.setItem("sessionID", sessionID);
    //   // save the ID of the user
    //   socket.userID = userID;
    // });
    socket.on("battle-found", () => {
      navigate("/play?rejoin", { replace: true });
    });
    socket.on("no-battle-found", () => {
      navigate("/pick", { replace: true });
    });

    return () => {
      socket.off("battle-found");
      socket.off("no-battle-found");
    };
  }, [socket]);

  const input: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const submit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (username != "") {
      console.log("here1");
      dispatch(setStateUsername(username));
      console.log("here2");
      
      socket.emit("join", username);
    }
  };

  return (
    <Wrapper>
      <input value={username} onChange={input} />
      <button onClick={submit}>Start!</button>
    </Wrapper>
  );
}

export default StartScreen;
