import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Card from './components/Card';
import DetailsPanel from './components/DetailsPanel';

import data from './data.json';

const mockContainersData = data.containers;

function App() {
  const [selectedContainer, setSelectedContainer] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 overflow-hidden w-screen">
          <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
              {mockContainersData.map(container => (
                <Card
                  key={container.Id}
                  container={container}
                  onClick={() => setSelectedContainer(container)}
                />
              ))}
            </div>
            <div className="w-2/3 bg-gray-200 p-4 ml-1">
              <DetailsPanel selectedContainer={selectedContainer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
