import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DetailsPanel from './components/DetailsPanel';
import ContainersList from './components/Containers/ContainersList';

import data from './data.json';

const mockContainersData = data.containers;


function App() {
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(true);

  const filteredContainers = mockContainersData.filter(container => {
    const matchesSearchQuery = container.Names[0].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShowAll = showAll || container.State.toLocaleLowerCase() === 'running';
    return matchesSearchQuery && matchesShowAll;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex p-6 bg-gray-100 flex-1 overflow-hidden mb-2">
          <div className="h-full w-full mt-4 flex rounded-lg overflow-hidden">
            <div className="w-1/3 bg-gray-200 p-2 overflow-y-auto">
              <ContainersList
                containers={filteredContainers}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showAll={showAll}
                setShowAll={setShowAll}
                onContainerClick={setSelectedContainer}
              />
            </div>
            <div className="w-2/3 bg-gray-200 p-2 ml-1 overflow-y-auto">
              <DetailsPanel selectedContainer={selectedContainer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
