import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ContainerProvider } from './state/ContainerContext';
import { ImagesProvider } from "./state/ImagesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContainerProvider >
      <ImagesProvider >
        <App />
      </ImagesProvider>

    </ContainerProvider>

  </React.StrictMode>,
);
