import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ContainerProvider } from './state/ContainerContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContainerProvider >
      <App />
    </ContainerProvider>

  </React.StrictMode>,
);
