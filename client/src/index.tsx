import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartScreen from "start/StartScreen";
import PickScreen from "pick/PickScreen";
import store from "app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<StartScreen />} />
            <Route path="/pick" element={<PickScreen />} />
          </Route>
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
