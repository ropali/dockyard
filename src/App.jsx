import React, {useEffect, useRef} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ContainersScreen from './components/Screens/ContainersScreen';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagesScreen from './components/Screens/ImagesScreen';
import VolumesScreen from './components/Screens/VolumesScreen';
import NetworkScreen from './components/Screens/NetworkScreen';
import SettingsScreen from './components/Screens/SettingsScreen';
import {useSettings} from './state/SettingsContext';
import {DEFAULT_THEME, DOCKER_SERVICE_PING_INTERVAL} from './constants';
import {invoke} from "@tauri-apps/api/tauri";
import ErrorScreen from "./components/Screens/ErrorScreen.jsx";

function App() {
    const {settings} = useSettings();
    const navigate = useNavigate();
    const location = useLocation();
    const intervalRef = useRef(null);

    const loadTheme = () => {
        document.documentElement.setAttribute('data-theme', settings?.theme || DEFAULT_THEME);
    }

    const ping = () => {
        invoke("ping").then(r => {
            console.log(r);
        }).catch((e) => {
            console.log(e)
            navigate("/error", {state: {message: "Docker API not reachable.\nMake sure Docker API is running at unix:///var/run/docker.sock"}});
        });
    }

    useEffect(() => {
        loadTheme();

        // Check if service is running at the time of page load
        ping();

        if (location.pathname !== '/error') {
            intervalRef.current = setInterval(ping, DOCKER_SERVICE_PING_INTERVAL);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

    }, [settings?.theme, navigate, location.pathname]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-base-100">
            <Sidebar className="w-64 flex-shrink-0"/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <ToastContainer
                    theme="dark"
                    position="bottom-right"
                    toastClassName="bg-base-100 text-base-content"
                />
                <main className="flex p-5 bg-base-200 flex-1 overflow-hidden mb-2">
                    <Routes>
                        <Route path="/" element={<ContainersScreen/>}/>
                        <Route path="/images" element={<ImagesScreen/>}/>
                        <Route path="/volumes" element={<VolumesScreen/>}/>
                        <Route path="/networks" element={<NetworkScreen/>}/>
                        <Route path="/settings" element={<SettingsScreen/>}/>
                        <Route path="/error" element={<ErrorScreen/>}/>
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;