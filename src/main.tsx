import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConnectorsProvider } from "./contexts/connectors";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectorsProvider>
      <App />
    </ConnectorsProvider>
  </React.StrictMode>
);
