import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import App from "./App";
import { config } from "./connectors/wagmi-connectors";
import { ConnectorsProvider } from "./contexts/connectors";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectorsProvider>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </ConnectorsProvider>
  </React.StrictMode>
);
