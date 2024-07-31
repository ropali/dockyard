import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DetailsPanel from './components/DetailsPanel';
import ContainersList from './components/Containers/ContainersList';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContainers } from './state/ContainerContext';



function App() {

  const { selectedContainer } = useContainers();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <ToastContainer />
        <main className="flex p-5 bg-gray-100 flex-1 overflow-hidden mb-2">
          <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">

            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
              <ContainersList />
            </div>
            <div className={`w-full bg-gray-200 ml-1 overflow-hidden	 ${selectedContainer ? 'bg-white' : 'bg-gray-200'}`}>
              <DetailsPanel />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
