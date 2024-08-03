import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import ContainersScreen from './components/Screens/ContainersScreen'
// import Dashboard from './components/Dashboard';
// import Images from './components/Images';
// import Volumes from './components/Volumes';
// import Networks from './components/Networks';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImagesScreen from './components/Screens/ImagesScreen';


function App() {

  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar className="w-64 flex-shrink-0" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ToastContainer />
          <main className="flex p-5 bg-gray-100 flex-1 overflow-hidden mb-2">
            <Routes>
              {/* <Route path="/" element={<Navigate to="/" replace />} /> */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/" element={<ContainersScreen />} />
              <Route path="/images" element={<ImagesScreen />} />
              {/* <Route path="/volumes" element={<Volumes />} />
              <Route path="/networks" element={<Networks />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;