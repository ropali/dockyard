import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ContainerProvider } from './state/ContainerContext';
import { ImagesProvider } from "./state/ImagesContext";
import { VolumesProvider } from "./state/VolumesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <VolumesProvider >
      <ContainerProvider >
        <ImagesProvider >
          <App />
        </ImagesProvider>
      </ContainerProvider>
    </VolumesProvider>

  </React.StrictMode>,
);
