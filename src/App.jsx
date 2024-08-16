import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import ContainersScreen from './components/Screens/ContainersScreen'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagesScreen from './components/Screens/ImagesScreen';
import VolumesScreen from './components/Screens/VolumesScreen';
import NetworkScreen from './components/Screens/NetworkScreen';
import SettingsScreen from './components/Screens/SettingsScreen';
import Dashboard from './components/Screens/Dashboard';


function App() {

  const loadTheme = () => {
    let theme = localStorage.getItem("theme") || 'light';

    document.documentElement.setAttribute('data-theme', theme);

  }

  useEffect(() => {
    loadTheme()

  }, [])


  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-base-100">
        <Sidebar className="w-64 flex-shrink-0" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ToastContainer
            theme="dark"
            position="bottom-right"
            toastClassName="bg-base-100 text-base-content"
          />
          <main className="flex p-5 bg-base-200 flex-1 overflow-hidden mb-2">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/" element={<ContainersScreen />} />
              <Route path="/images" element={<ImagesScreen />} />
              <Route path="/volumes" element={<VolumesScreen />} />
              <Route path="/networks" element={<NetworkScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;