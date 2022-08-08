import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartScreen from "start/StartScreen";
import PickScreen from "pick/PickScreen";
import store from "app/store";
import { Provider } from "react-redux";
import { SocketContext, socket } from "context/socket";
import PlayScreen from "play/PlayScreen";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <React.StrictMode>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<StartScreen />} />
              <Route path="/pick" element={<PickScreen />} />
              <Route path="/play" element={<PlayScreen />} />
            </Route>
          </Routes>
        </React.StrictMode>
      </BrowserRouter>
    </SocketContext.Provider>
  </Provider>
);
