import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ContainerProvider } from './state/ContainerContext';
import { ImagesProvider } from "./state/ImagesContext";
import { VolumesProvider } from "./state/VolumesContext";
import { NetworksProvider } from "./state/NetworkContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <VolumesProvider >
      <ContainerProvider >
        <ImagesProvider >
          <NetworksProvider>
            <App />
          </NetworksProvider>
        </ImagesProvider>
      </ContainerProvider>
    </VolumesProvider>

  </React.StrictMode>,
);
