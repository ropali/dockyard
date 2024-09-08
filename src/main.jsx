import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {ContainerProvider} from './state/ContainerContext';
import {ImagesProvider} from "./state/ImagesContext";
import {VolumesProvider} from "./state/VolumesContext";
import {NetworksProvider} from "./state/NetworkContext";
import {SettingsProvider} from "./state/SettingsContext";
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <SettingsProvider>
                <VolumesProvider>
                    <ContainerProvider>
                        <ImagesProvider>
                            <NetworksProvider>
                                <App/>
                            </NetworksProvider>
                        </ImagesProvider>
                    </ContainerProvider>
                </VolumesProvider>
            </SettingsProvider>
            </Router>

    </React.StrictMode>

);
